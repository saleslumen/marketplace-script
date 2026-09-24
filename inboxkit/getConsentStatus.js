/**
 * @description Poll InboxKit consent request status once.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.consentRequestUid
 * @returns {Object}
 */
async function getConsentStatus(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const consentRequestUid = asString(req.consentRequestUid || req.requestId);
  if (!workspaceId) throw new Error("INBOXKIT_REQUEST_FAILED: workspaceId is required");
  if (!consentRequestUid) throw new Error("INBOXKIT_REQUEST_FAILED: consentRequestUid is required");
  const response = await inboxKitRequest(`/v1/api/mailboxes/consent-request/status/${encodeURIComponent(consentRequestUid)}`, "GET", undefined, workspaceId);
  if (response.error) throw new Error(`INBOXKIT_REQUEST_FAILED: ${asString(response.message) || "status failed"}`);
  const data = response.data || {};
  const mailbox = data.mailbox || {};
  return {
    consentRequestUid: asString(data.uid || consentRequestUid),
    status: asString(data.status),
    statusText: asString(data.status_text),
    statusReason: asString(data.status_reason),
    mailboxEmail: asString(mailbox.email),
    mailboxUid: asString(mailbox.uid),
    completedAt: asString(data.completed_at),
  };
}
