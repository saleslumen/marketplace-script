/**
 * @description Daily warmup report for one email account. from defaults to 30 days before to; to defaults to today.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @param {string} [input.from]
 * @param {string} [input.to]
 * @returns {Object}
 */
async function getAccountReport(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = accountIdFrom(req);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const body = { emailAccountId: Number.isFinite(Number(emailAccountId)) ? Number(emailAccountId) : emailAccountId };
  if (asString(req.from)) body.from = asString(req.from);
  if (asString(req.to)) body.to = asString(req.to);
  const classified = classifyHttp(await trulyinboxRequestRaw("/reports", "POST", body));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { emailAccountId });
  }
  if (classified.status === 404) {
    return { ok: false, outcome: "REPORT_MISSING", retryable: false, emailAccountId, failure: classified.message || "Report not found" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "REPORT_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Report failed (${classified.status})`,
    };
  }
  return { ok: true, outcome: "REPORT", retryable: false, failure: "", ...mapAccountReport(classified.body) };
}
