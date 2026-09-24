/**
 * @description Idempotently reconcile an unexpected ERROR/CANCELLED execution into the matching operation. Skips when Workflow Failure Execution ID already matches.
 * @param {Object} input
 * @param {string} [input.recordId]
 * @param {string} [input.namespaceId]
 * @param {string} input.executionId
 * @param {string} [input.correlationId]
 * @param {string} [input.workflow]
 * @param {string} [input.workflowId]
 * @param {string} [input.errorMessage]
 * @param {string} [input.status]
 * @param {string} [input.completedAt]
 * @returns {Object}
 * @property {boolean} reconciled
 * @property {boolean} skipped
 */
async function reconcileExecutionFailure(input) {
  const req = input && typeof input === "object" ? input : {};
  const executionId = asString(req.executionId);
  if (!executionId) throw new Error("AIRTABLE_REQUEST_FAILED: executionId is required");
  const correlationId = asString(req.correlationId);
  if (!correlationId) {
    return { reconciled: false, skipped: true, reason: "MISSING_CORRELATION_ID", executionId };
  }
  const recordId = asString(req.recordId);
  const namespaceId = asString(req.namespaceId);
  let client = null;
  if (recordId) client = await getClient({ recordId, correlationId });
  else if (namespaceId) client = await getClient({ namespaceId, correlationId });
  else client = await getClient({ correlationId });
  if (!client || !client.found) {
    return { reconciled: false, skipped: true, reason: "CLIENT_NOT_FOUND", executionId };
  }
  const workflow = asString(req.workflow || req.workflowName);
  const key = operationKey(client.recordId, correlationId, workflow);
  const byKey = client.operations && client.operations.byKey ? client.operations.byKey : {};
  let existingOp = key && byKey[key] ? byKey[key] : null;
  if (!existingOp) existingOp = findOperation(client.operations, { correlationId });
  if (!existingOp) {
    return {
      reconciled: false,
      skipped: true,
      reason: "OPERATION_NOT_FOUND",
      executionId,
      correlationId,
      recordId: client.recordId,
      namespaceId: client.namespaceId,
    };
  }
  const operationStatus = asString(existingOp.status).toUpperCase();
  if (operationStatus === "SUCCEEDED") {
    return {
      reconciled: false,
      skipped: true,
      reason: "OPERATION_ALREADY_SUCCEEDED",
      executionId,
      recordId: client.recordId,
      namespaceId: client.namespaceId,
    };
  }
  const completedAt = asString(req.completedAt);
  const completedAtMs = Date.parse(completedAt);
  if (!completedAt || !Number.isFinite(completedAtMs)) {
    return {
      reconciled: false,
      skipped: true,
      reason: completedAt ? "INVALID_COMPLETED_AT" : "MISSING_COMPLETED_AT",
      executionId,
      recordId: client.recordId,
      namespaceId: client.namespaceId,
    };
  }
  const operationUpdatedAt = asString(existingOp.updatedAt);
  const operationUpdatedAtMs = Date.parse(operationUpdatedAt);
  if (Number.isFinite(operationUpdatedAtMs) && operationUpdatedAtMs >= completedAtMs) {
    return {
      reconciled: false,
      skipped: true,
      reason: "STALE_EXECUTION",
      executionId,
      recordId: client.recordId,
      namespaceId: client.namespaceId,
    };
  }
  const already =
    asString(existingOp.failureExecutionId) === executionId || asString(client.failureExecutionId) === executionId;
  if (already) {
    return {
      reconciled: false,
      skipped: true,
      reason: "ALREADY_RECONCILED",
      executionId,
      recordId: client.recordId,
      namespaceId: client.namespaceId,
    };
  }
  const errorMessage = asString(req.errorMessage || req.failure) || `Workflow execution ${asString(req.status) || "ERROR"}`;
  const written = await writeStatus({
    recordId: client.recordId,
    namespaceId: client.namespaceId,
    status: "FAILED",
    stage: asString(existingOp.stage) || asString(client.stage) || "operate",
    progress: "Unexpected execution failure reconciled by the organization reconciler",
    blocker: "Workflow execution failed unexpectedly",
    failure: errorMessage,
    nextAction: "Operator: inspect execution error, fix root cause, retry with same correlationId",
    workflow: workflow || asString(existingOp.workflow) || "execution-monitor",
    correlationId,
    failureExecutionId: executionId,
    linearIssueId: asString(existingOp.linearIssueId),
  });
  return {
    reconciled: true,
    skipped: false,
    executionId,
    recordId: written.recordId,
    namespaceId: written.namespaceId,
    correlationId: written.correlationId,
    status: written.status,
  };
}
