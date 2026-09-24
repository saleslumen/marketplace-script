/**
 * @description Upsert one Operations row for the operation key and recompute Clients glance fields. Never stores secrets.
 * @param {Object} input
 * @param {string} [input.recordId]
 * @param {string} [input.namespaceId]
 * @param {string} input.status
 * @param {string} [input.stage]
 * @param {string} [input.progress]
 * @param {string} [input.blocker]
 * @param {string} [input.failure]
 * @param {string} [input.nextAction]
 * @param {string} [input.workflow]
 * @param {string} [input.correlationId]
 * @param {string} [input.linearIssueId]
 * @param {string} [input.browserbaseSessionId]
 * @param {string} [input.workspaceId] - Persists Clients `Mailbox Workspace ID`
 * @param {string} [input.mailboxPlane] - Persists Clients `Mailbox Plane` (`zapmail` or `inboxkit`)
 * @param {string} [input.trulyInboxWorkspaceId] - Persists Clients `TrulyInbox Workspace ID`
 * @param {string} [input.cloudflareAccountId] - Persists Clients `Cloudflare Account ID`
 * @param {string} [input.webhookDeliveryId]
 * @param {string} [input.failureExecutionId]
 * @param {boolean|string} [input.incrementTrustAttemptCount]
 * @param {boolean|string} [input.googleAdminTrusted]
 * @param {boolean|string} [input.clearLinearIssueId]
 * @param {boolean|string} [input.clearBrowserbaseSessionId]
 * @returns {Object}
 */
async function writeStatus(input) {
  const req = input && typeof input === "object" ? input : {};
  const status = asString(req.status).toUpperCase();
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`AIRTABLE_REQUEST_FAILED: status must be one of ${VALID_STATUSES.join(", ")}`);
  }
  let recordId = asString(req.recordId);
  const namespaceId = asString(req.namespaceId);
  let current = null;
  if (!recordId && namespaceId) {
    current = await getClient({ namespaceId });
    if (!current.found) throw new Error("AIRTABLE_REQUEST_FAILED: client not found for namespaceId");
    recordId = current.recordId;
  }
  if (!recordId) throw new Error("AIRTABLE_REQUEST_FAILED: recordId or namespaceId is required");
  if (!current) current = await getClient({ recordId });
  if (!current.found) throw new Error("AIRTABLE_REQUEST_FAILED: client not found");
  const workflow = asString(req.workflow);
  const correlationId = asString(req.correlationId);
  const key = operationKey(recordId, correlationId, workflow);
  if (!key) throw new Error("AIRTABLE_REQUEST_FAILED: correlationId or workflow is required for operation status");
  const updatedAt = utcNowIso();
  const previous =
    (current.operations && current.operations.byKey && current.operations.byKey[key]) ||
    findOperation(current.operations, { correlationId, workflow }) ||
    {};
  const operation = {
    key,
    clientRecordId: recordId,
    namespaceId: namespaceId || asString(current.namespaceId) || asString(previous.namespaceId),
    correlationId: correlationId || asString(previous.correlationId),
    workflow: workflow || asString(previous.workflow),
    status,
    updatedAt,
    stage: asString(previous.stage),
    progress: asString(previous.progress),
    blocker: asString(previous.blocker),
    failure: asString(previous.failure),
    nextAction: asString(previous.nextAction),
    linearIssueId: asString(previous.linearIssueId),
    browserbaseSessionId: asString(previous.browserbaseSessionId),
    trustAttemptCount: Number(previous.trustAttemptCount) || 0,
    webhookDeliveryId: asString(previous.webhookDeliveryId),
    failureExecutionId: asString(previous.failureExecutionId),
    adminMailboxEmail: asString(previous.adminMailboxEmail),
    adminMailboxUid: asString(previous.adminMailboxUid),
    linearTeamId: asString(previous.linearTeamId),
    workspaceId: asString(previous.workspaceId),
    trustHistoryStatus: asString(previous.trustHistoryStatus),
    trustCompletedAt: asString(previous.trustCompletedAt),
    connectExecutionId: asString(previous.connectExecutionId),
  };
  if (asString(req.stage)) operation.stage = asString(req.stage);
  if (asString(req.progress)) operation.progress = asString(req.progress);
  if (asString(req.nextAction)) operation.nextAction = asString(req.nextAction);
  if (asString(req.workspaceId)) operation.workspaceId = asString(req.workspaceId);
  if (asString(req.adminMailboxEmail)) operation.adminMailboxEmail = asString(req.adminMailboxEmail);
  if (asString(req.adminMailboxUid)) operation.adminMailboxUid = asString(req.adminMailboxUid);
  if (asString(req.linearTeamId)) operation.linearTeamId = asString(req.linearTeamId);
  if (asString(req.webhookDeliveryId)) operation.webhookDeliveryId = asString(req.webhookDeliveryId);
  if (asString(req.failureExecutionId)) operation.failureExecutionId = asString(req.failureExecutionId);
  if (req.incrementTrustAttemptCount === true || asString(req.incrementTrustAttemptCount).toLowerCase() === "true") {
    operation.trustAttemptCount = (Number(previous.trustAttemptCount) || 0) + 1;
  } else if (req.trustAttemptCount !== undefined && req.trustAttemptCount !== null && asString(req.trustAttemptCount) !== "") {
    operation.trustAttemptCount = Number(req.trustAttemptCount) || 0;
  }
  if (status === "SUCCEEDED" || status === "RUNNING" || status === "QUEUED") {
    operation.blocker = "";
    operation.failure = "";
  } else if (status === "BLOCKED_HUMAN") {
    operation.blocker = asString(req.blocker) || asString(req.nextAction) || "Waiting on human action";
    operation.failure = asString(req.failure);
  } else {
    operation.blocker = asString(req.blocker);
    operation.failure = asString(req.failure);
  }
  if (asString(req.linearIssueId)) operation.linearIssueId = asString(req.linearIssueId);
  if (req.clearLinearIssueId === true || asString(req.clearLinearIssueId).toLowerCase() === "true") {
    operation.linearIssueId = "";
  }
  if (asString(req.trustHistoryStatus)) {
    operation.trustHistoryStatus = asString(req.trustHistoryStatus);
    if (asString(req.trustHistoryStatus).toUpperCase() === "COMPLETED" && !asString(operation.trustCompletedAt)) {
      operation.trustCompletedAt = updatedAt;
    }
  }
  if (asString(req.trustCompletedAt)) operation.trustCompletedAt = asString(req.trustCompletedAt);
  if (asString(req.connectExecutionId)) operation.connectExecutionId = asString(req.connectExecutionId);
  if (asString(req.browserbaseSessionId)) operation.browserbaseSessionId = asString(req.browserbaseSessionId);
  if (req.clearBrowserbaseSessionId === true || asString(req.clearBrowserbaseSessionId).toLowerCase() === "true") {
    operation.browserbaseSessionId = "";
  }
  const operationFields = {
    [OP_FIELD.key]: operation.key,
    [OP_FIELD.clientRecordId]: operation.clientRecordId,
    [OP_FIELD.namespaceId]: operation.namespaceId,
    [OP_FIELD.correlationId]: operation.correlationId,
    [OP_FIELD.workflow]: operation.workflow,
    [OP_FIELD.status]: operation.status,
    [OP_FIELD.stage]: operation.stage,
    [OP_FIELD.progress]: operation.progress,
    [OP_FIELD.blocker]: operation.blocker,
    [OP_FIELD.failure]: operation.failure,
    [OP_FIELD.nextAction]: operation.nextAction,
    [OP_FIELD.linearIssueId]: operation.linearIssueId,
    [OP_FIELD.browserbaseSessionId]: operation.browserbaseSessionId,
    [OP_FIELD.updatedAt]: operation.updatedAt,
    [OP_FIELD.trustAttemptCount]: Number(operation.trustAttemptCount) || 0,
    [OP_FIELD.webhookDeliveryId]: operation.webhookDeliveryId,
    [OP_FIELD.failureExecutionId]: operation.failureExecutionId,
    [OP_FIELD.adminMailboxEmail]: operation.adminMailboxEmail,
    [OP_FIELD.adminMailboxUid]: operation.adminMailboxUid,
    [OP_FIELD.linearTeamId]: operation.linearTeamId,
    [OP_FIELD.workspaceId]: operation.workspaceId,
    [OP_FIELD.trustHistoryStatus]: operation.trustHistoryStatus,
    [OP_FIELD.trustCompletedAt]: operation.trustCompletedAt,
    [OP_FIELD.connectExecutionId]: operation.connectExecutionId,
  };
  const upserted = await upsertOperationRow(operationFields);
  await pruneSucceededOperations(recordId);
  const durableClientFields = {};
  if (namespaceId) durableClientFields[FIELD.namespaceId] = namespaceId;
  const mailboxPlane = resolveMailboxPlane(req.mailboxPlane, current.mailboxPlane, "AIRTABLE_REQUEST_FAILED");
  if (asString(req.workspaceId) || asString(current.workspaceId)) {
    durableClientFields[FIELD.workspaceId] = asString(req.workspaceId || current.workspaceId);
  }
  if (mailboxPlane) durableClientFields[FIELD.mailboxPlane] = mailboxPlane;
  if (asString(req.trulyInboxWorkspaceId) || asString(current.trulyInboxWorkspaceId)) {
    durableClientFields[FIELD.trulyInboxWorkspaceId] = asString(req.trulyInboxWorkspaceId || current.trulyInboxWorkspaceId);
  }
  if (asString(req.cloudflareAccountId) || asString(current.cloudflareAccountId)) {
    durableClientFields[FIELD.cloudflareAccountId] = asString(req.cloudflareAccountId || current.cloudflareAccountId);
  }
  if (asString(req.adminMailboxEmail)) durableClientFields[FIELD.adminMailboxEmail] = asString(req.adminMailboxEmail);
  if (asString(req.adminMailboxUid)) durableClientFields[FIELD.adminMailboxUid] = asString(req.adminMailboxUid);
  if (asString(req.linearTeamId)) durableClientFields[FIELD.linearTeamId] = asString(req.linearTeamId);
  if (req.googleAdminTrusted === true || asString(req.googleAdminTrusted).toLowerCase() === "true") {
    durableClientFields[FIELD.googleAdminTrusted] = true;
  }
  if (Object.keys(durableClientFields).length) await patchRecord(recordId, durableClientFields);
  const glance = await reconcileClientGlance({ recordId });
  return {
    recordId,
    namespaceId: glance.namespaceId || namespaceId || current.namespaceId,
    status: glance.status,
    operationStatus: status,
    operationKey: key,
    operationRecordId: upserted.recordId,
    stage: glance.stage,
    progress: glance.progress,
    correlationId: glance.correlationId,
    linearIssueId: glance.linearIssueId,
    browserbaseSessionId: glance.browserbaseSessionId,
    trustAttemptCount: Number(operation.trustAttemptCount) || 0,
    webhookDeliveryId: asString(operation.webhookDeliveryId) || asString(glance.webhookDeliveryId),
    failureExecutionId: asString(operation.failureExecutionId) || asString(glance.failureExecutionId),
    updatedAt,
    success: true,
  };
}
