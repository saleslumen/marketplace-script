/**
 * @description Daily warmup reports for up to 50 email accounts.
 * @param {Object} input
 * @param {string|string[]|number[]} input.emailAccountIds
 * @param {string} [input.from]
 * @param {string} [input.to]
 * @returns {Object}
 */
async function getBulkReport(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountIds = asIdList(req.emailAccountIds);
  if (!emailAccountIds.length) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, reports: [], failure: "emailAccountIds is required" };
  }
  if (emailAccountIds.length > 50) {
    return { ok: false, outcome: "BULK_REPORT_LIMIT", retryable: false, reports: [], failure: "emailAccountIds is limited to 50 accounts" };
  }
  const body = { emailAccountIds };
  if (asString(req.from)) body.from = asString(req.from);
  if (asString(req.to)) body.to = asString(req.to);
  const classified = classifyHttp(await trulyinboxRequestRaw("/reports/bulk", "POST", body));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { reports: [] });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "BULK_REPORT_FAILED",
      retryable: false,
      reports: [],
      failure: classified.message || `Bulk report failed (${classified.status})`,
    };
  }
  const reports = (Array.isArray(classified.body.reports) ? classified.body.reports : []).map(mapAccountReport);
  return { ok: true, outcome: "BULK_REPORT", retryable: false, reports, failure: "" };
}
