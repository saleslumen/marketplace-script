/**
 * @description Submit Saleslumen Google OAuth URLs to Zapmail custom-oauth.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.clientId
 * @param {string} input.appName
 * @param {Object[]} input.mailboxes
 * @param {string|string[]} input.consentUrls
 */
async function initiateCustomOAuth(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const clientId = asString(req.clientId);
  const appName = asString(req.appName || req.app);
  const mailboxes = parseJsonArray(req.mailboxes);
  const consentUrls = parseJsonArray(req.consentUrls || req.oauthLinks || req.authUrls);
  if (!workspaceId) throw new Error("ZAPMAIL_REQUEST_FAILED: workspaceId is required");
  if (!clientId) throw new Error("ZAPMAIL_REQUEST_FAILED: clientId is required");
  if (!appName) throw new Error("ZAPMAIL_REQUEST_FAILED: appName is required");
  if (!mailboxes.length) throw new Error("ZAPMAIL_REQUEST_FAILED: mailboxes is required");
  if (consentUrls.length !== mailboxes.length) {
    throw new Error(`ZAPMAIL_REQUEST_FAILED: expected ${mailboxes.length} consent URL(s), got ${consentUrls.length}`);
  }
  const mailboxesPerDomain = {};
  mailboxes.forEach((mailbox, index) => {
    const domainId = asString(mailbox.domainId);
    const mailboxId = asString(mailbox.uid || mailbox.mailboxId);
    if (!domainId || !mailboxId) throw new Error("ZAPMAIL_REQUEST_FAILED: each mailbox needs uid and domainId");
    if (!mailboxesPerDomain[domainId]) mailboxesPerDomain[domainId] = [];
    mailboxesPerDomain[domainId].push({ mailboxId, oauthLink: asString(consentUrls[index]) });
  });
  const raw = await zapmailRequestRaw("/v2/mailboxes/custom-oauth", "POST", {
    google: { appName, clientId, mailboxesPerDomain },
  }, workspaceId);
  if (raw.status === 404 || raw.status === 429) {
    return {
      ok: false,
      outcome: raw.status === 429 ? "RATE_LIMITED" : "OAUTH_PENDING",
      exportId: "",
      retryable: true,
      failure: asString(raw.body.message || raw.text),
    };
  }
  if (raw.status === 400 || raw.status === 422) {
    return { ok: false, outcome: "OAUTH_FAILED", exportId: "", retryable: false, failure: asString(raw.body.message || raw.text) };
  }
  if (raw.status < 200 || raw.status >= 300) {
    const retryable = raw.status === 408 || raw.status >= 500;
    return {
      ok: false,
      outcome: retryable ? "OAUTH_PENDING" : "OAUTH_FAILED",
      exportId: "",
      retryable,
      failure: asString(raw.body.message || raw.text),
    };
  }
  const data = (raw.body && raw.body.data) || {};
  return {
    ok: true,
    outcome: "OAUTH_INITIATED",
    exportId: asString(data.exportId || data.export_id),
    retryable: false,
    failure: "",
  };
}
