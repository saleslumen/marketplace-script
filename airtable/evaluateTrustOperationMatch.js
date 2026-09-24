/**
 * @description Confirm the webhook issue maps to the dedicated Google Admin trust operation (issue id + correlation + expected workflow/state).
 * @param {Object} input
 * @param {string} [input.recordId]
 * @param {string} input.linearIssueId
 * @param {string} input.correlationId - From issue sl-correlation marker
 * @returns {Object}
 * @property {boolean} ok
 * @property {string} outcome
 * @property {string} failure
 */
async function evaluateTrustOperationMatch(input) {
  const req = input && typeof input === "object" ? input : {};
  const linearIssueId = asString(req.linearIssueId);
  const correlationId = asString(req.correlationId);
  if (!linearIssueId) {
    return { ok: false, outcome: "MISSING_ISSUE", correlationId, failure: "linearIssueId is required" };
  }
  if (!correlationId) {
    return {
      ok: false,
      outcome: "MISSING_CORRELATION_MARKER",
      linearIssueId,
      correlationId: "",
      failure: "Issue must embed sl-correlation marker matching the trust operation",
    };
  }
  const recordId = asString(req.recordId);
  const client = recordId
    ? await getClient({ recordId, linearIssueId, correlationId })
    : await getClient({ linearIssueId, correlationId });
  if (!client.found) {
    return { ok: false, outcome: "CLIENT_NOT_FOUND", linearIssueId, correlationId, failure: "No Airtable client for issue" };
  }
  const expectedWorkflows = [
    "Google Admin trust handoff to Linear (InboxKit)",
    "Linear Google Admin trust completion",
    "InboxKit email accounts to Saleslumen Emails",
    "Google Admin trust handoff to Linear (Zapmail)",
    "Zapmail email accounts to Saleslumen Emails",
  ];
  const operation =
    findOperation(client.operations, { linearIssueId, correlationId }) ||
    findOperation(client.operations, { correlationId });
  if (!operation || asString(operation.linearIssueId) !== linearIssueId) {
    return {
      ok: false,
      outcome: "TRUST_OPERATION_NOT_FOUND",
      linearIssueId,
      correlationId,
      recordId: client.recordId,
      namespaceId: client.namespaceId,
      failure: "No trust operation persists this Linear issue id with the correlation marker",
    };
  }
  if (asString(operation.correlationId) !== correlationId) {
    return {
      ok: false,
      outcome: "CORRELATION_MISMATCH",
      linearIssueId,
      correlationId,
      recordId: client.recordId,
      namespaceId: client.namespaceId,
      failure: "Persisted operation correlationId does not match issue marker",
    };
  }
  const workflow = asString(operation.workflow);
  const trustHistoryStatus = asString(operation.trustHistoryStatus).toUpperCase();
  const workflowAllowed =
    !workflow || expectedWorkflows.includes(workflow) || trustHistoryStatus === "COMPLETED";
  if (!workflowAllowed) {
    return {
      ok: false,
      outcome: "WORKFLOW_MISMATCH",
      linearIssueId,
      correlationId,
      workflow,
      recordId: client.recordId,
      namespaceId: client.namespaceId,
      failure: `Operation workflow ${workflow} is not a Google Admin trust/connect workflow`,
    };
  }
  const status = asString(operation.status).toUpperCase();
  const allowed = ["BLOCKED_HUMAN", "RETRYING", "FAILED", "RUNNING", "SUCCEEDED", "QUEUED"];
  if (!allowed.includes(status)) {
    return {
      ok: false,
      outcome: "UNEXPECTED_STATUS",
      linearIssueId,
      correlationId,
      status,
      recordId: client.recordId,
      namespaceId: client.namespaceId,
      failure: `Trust operation status ${status || "(empty)"} is not eligible for completion`,
    };
  }
  return {
    ok: true,
    outcome: "TRUST_OPERATION_MATCHED",
    linearIssueId,
    correlationId,
    workflow,
    status,
    recordId: client.recordId,
    namespaceId: client.namespaceId,
    workspaceId: asString(operation.workspaceId || client.workspaceId),
    mailboxPlane: asMailboxPlane(client.mailboxPlane),
    browserbaseSessionId: asString(operation.browserbaseSessionId || client.browserbaseSessionId),
    adminMailboxEmail: asString(operation.adminMailboxEmail || client.adminMailboxEmail),
    adminMailboxUid: asString(operation.adminMailboxUid || client.adminMailboxUid),
    googleAdminTrusted: client.googleAdminTrusted === true,
    trustHistoryStatus: asString(operation.trustHistoryStatus),
    failure: "",
  };
}
