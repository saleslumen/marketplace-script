/**
 * @description Get warmup settings for one email account. Does not invent scores.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function getWarmupSettings(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = asString(req.emailAccountId || req.id);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/warmup-settings/${encodeURIComponent(emailAccountId)}`, "GET"));
  if (classified.status === 429 || classified.retryable) {
    return { ok: false, outcome: "RATE_LIMITED", retryable: true, emailAccountId, failure: classified.message || "TrulyInbox rate limited (20 req/min)" };
  }
  if (classified.status === 404) {
    return { ok: false, outcome: "WARMUP_SETTINGS_MISSING", retryable: true, emailAccountId, failure: classified.message || "Warmup settings not found" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "WARMUP_SETTINGS_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Warmup settings failed (${classified.status})`,
    };
  }
  return {
    ok: true,
    outcome: "WARMUP_SETTINGS",
    retryable: false,
    failure: "",
    ...mapWarmupSettings(classified.body),
  };
}
