/**
 * @description Stop warmup for one connected email account.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function stopWarmup(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = accountIdFrom(req);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/warmup-settings/${encodeURIComponent(emailAccountId)}/stop`, "POST"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { emailAccountId });
  }
  if (classified.status === 422) {
    return {
      ok: false,
      outcome: "WARMUP_STOP_REJECTED",
      retryable: false,
      emailAccountId,
      failure: classified.message || "Warmup stop rejected",
    };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "WARMUP_STOP_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Warmup stop failed (${classified.status})`,
    };
  }
  return { ok: true, outcome: "WARMUP_STOPPED", retryable: false, emailAccountId, failure: "" };
}
