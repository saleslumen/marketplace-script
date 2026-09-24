/**
 * @description Get warmup deliverability rates for a date range. Optional esps: gmail, outlook, other.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @param {string} input.startDate
 * @param {string} input.endDate
 * @param {string|string[]} [input.esps]
 * @returns {Object}
 */
async function getDeliverabilityScore(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = accountIdFrom(req);
  const startDate = asString(req.startDate);
  const endDate = asString(req.endDate);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  if (!startDate || !endDate) {
    return { ok: false, outcome: "MISSING_DATE_RANGE", retryable: false, emailAccountId, failure: "startDate and endDate are required" };
  }
  const esps = asCsvList(req.esps).map((item) => item.toLowerCase());
  if (esps.some((item) => !DELIVERABILITY_ESPS.includes(item))) {
    return { ok: false, outcome: "INVALID_ESPS", retryable: false, emailAccountId, failure: "esps must be gmail, outlook, and/or other" };
  }
  const body = { startDate, endDate };
  if (esps.length) body.esps = esps;
  const classified = classifyHttp(await trulyinboxRequestRaw(`/deliverability-score/${encodeURIComponent(emailAccountId)}`, "POST", body));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { emailAccountId });
  }
  if (classified.status === 404) {
    return { ok: false, outcome: "DELIVERABILITY_SCORE_MISSING", retryable: false, emailAccountId, failure: classified.message || "Deliverability score not found" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "DELIVERABILITY_SCORE_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Deliverability score failed (${classified.status})`,
    };
  }
  return { ok: true, outcome: "DELIVERABILITY_SCORE", retryable: false, failure: "", ...mapDeliverabilityScore(classified.body) };
}
