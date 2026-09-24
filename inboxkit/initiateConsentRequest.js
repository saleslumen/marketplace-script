/**
 * @description Initiate an InboxKit mailbox consent request with a caller-supplied consent URL.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.consentUrl
 * @param {string} [input.mailboxUid]
 * @param {string} [input.username]
 * @param {string} [input.domain]
 * @returns {Object}
 */
async function initiateConsentRequest(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const consentUrl = asString(req.consentUrl || req.authUrl);
  const mailboxUid = asString(req.mailboxUid || req.uid);
  const username = asString(req.username);
  const domain = asString(req.domain || req.domainName);
  if (!workspaceId) throw new Error("INBOXKIT_REQUEST_FAILED: workspaceId is required");
  if (!consentUrl) throw new Error("INBOXKIT_REQUEST_FAILED: consentUrl is required");
  if (!mailboxUid && !(username && domain)) {
    throw new Error("INBOXKIT_REQUEST_FAILED: mailboxUid or username+domain is required");
  }
  const consentBody = { consent_url: consentUrl };
  if (mailboxUid) consentBody.mailbox_uid = mailboxUid;
  if (username) consentBody.username = username;
  if (domain) consentBody.domain = domain;
  const response = await inboxKitRequest("/v1/api/mailboxes/consent-request/initiate", "POST", consentBody, workspaceId);
  if (response.error) throw new Error(`INBOXKIT_REQUEST_FAILED: ${asString(response.message) || "consent initiate failed"}`);
  const data = response.data || {};
  return {
    consentRequestUid: asString(data.uid),
    status: asString(data.status),
    mailboxUid,
    mailboxEmail: asString(data.mailbox_email || req.email || (username && domain ? `${username}@${domain}` : "")),
  };
}
