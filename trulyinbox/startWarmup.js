/**
 * @description Start warmup for one connected email account.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function startWarmup(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = asString(req.emailAccountId || req.id);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/warmup-settings/${encodeURIComponent(emailAccountId)}/start`, "POST"));
  if (classified.status === 429 || classified.retryable) {
    return { ok: false, outcome: "RATE_LIMITED", retryable: true, emailAccountId, failure: classified.message || "TrulyInbox rate limited (20 req/min)" };
  }
  if (classified.status === 422) {
    return {
      ok: false,
      outcome: "WARMUP_START_REJECTED",
      retryable: false,
      emailAccountId,
      failure: classified.message || "Warmup start rejected",
    };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "WARMUP_START_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Warmup start failed (${classified.status})`,
    };
  }
  return { ok: true, outcome: "WARMUP_STARTED", retryable: false, emailAccountId, failure: "" };
}
