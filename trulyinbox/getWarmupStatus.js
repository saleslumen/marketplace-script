/**
 * @description Get documented warmup activity status. Does not invent or require scores.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function getWarmupStatus(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = asString(req.emailAccountId || req.id);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/warmup-status/${encodeURIComponent(emailAccountId)}`, "GET"));
  if (classified.status === 429 || classified.retryable) {
    return { ok: false, outcome: "RATE_LIMITED", retryable: true, emailAccountId, failure: classified.message || "TrulyInbox rate limited (20 req/min)" };
  }
  if (classified.status === 404) {
    return { ok: false, outcome: "WARMUP_STATUS_MISSING", retryable: true, emailAccountId, failure: classified.message || "Warmup status not found" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "WARMUP_STATUS_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Warmup status failed (${classified.status})`,
    };
  }
  return {
    ok: true,
    outcome: "WARMUP_STATUS",
    retryable: false,
    failure: "",
    ...mapWarmupStatus(classified.body),
  };
}
