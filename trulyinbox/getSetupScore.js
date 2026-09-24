/**
 * @description Get the cached setup score. Checks that have not run are omitted rather than returned as false.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function getSetupScore(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = accountIdFrom(req);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/setup-score/${encodeURIComponent(emailAccountId)}`, "GET"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { emailAccountId });
  }
  if (classified.status === 404) {
    return { ok: false, outcome: "SETUP_SCORE_MISSING", retryable: false, emailAccountId, failure: classified.message || "Setup score not found" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "SETUP_SCORE_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Setup score failed (${classified.status})`,
    };
  }
  return { ok: true, outcome: "SETUP_SCORE", retryable: false, failure: "", ...mapSetupScore(classified.body) };
}
