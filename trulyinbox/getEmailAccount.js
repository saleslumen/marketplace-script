/**
 * @description Get one email account via the documented status endpoint.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function getEmailAccount(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = asString(req.emailAccountId || req.id);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/email-accounts/${encodeURIComponent(emailAccountId)}/status`, "GET"));
  if (classified.status === 429 || classified.retryable) {
    return { ok: false, outcome: "RATE_LIMITED", retryable: true, failure: classified.message || "TrulyInbox rate limited (20 req/min)" };
  }
  if (classified.status === 404) {
    return { ok: false, outcome: "EMAIL_ACCOUNT_MISSING", retryable: false, emailAccountId, failure: classified.message || "Email account not found" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "EMAIL_ACCOUNT_STATUS_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Email account status failed (${classified.status})`,
    };
  }
  return {
    ok: true,
    outcome: "EMAIL_ACCOUNT_STATUS",
    retryable: false,
    failure: "",
    ...mapAccountStatus(classified.body),
  };
}
