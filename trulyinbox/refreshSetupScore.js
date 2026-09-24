/**
 * @description Synchronously refresh the setup score for one email account.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function refreshSetupScore(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = accountIdFrom(req);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/setup-score/${encodeURIComponent(emailAccountId)}/refresh`, "POST"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { emailAccountId });
  }
  if (classified.status === 404) {
    return { ok: false, outcome: "SETUP_SCORE_MISSING", retryable: false, emailAccountId, failure: classified.message || "Setup score not found" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "SETUP_SCORE_REFRESH_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Setup score refresh failed (${classified.status})`,
    };
  }
  return { ok: true, outcome: "SETUP_SCORE_REFRESHED", retryable: false, failure: "", ...mapSetupScore(classified.body) };
}
