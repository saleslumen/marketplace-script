/**
 * @description Request an async warmup report export emailed as CSV. from and to are required. emailAccountIds omitted exports every account.
 * @param {Object} input
 * @param {string} input.from
 * @param {string} input.to
 * @param {string|string[]|number[]} [input.emailAccountIds]
 * @returns {Object}
 */
async function exportReport(input) {
  const req = input && typeof input === "object" ? input : {};
  const from = asString(req.from);
  const to = asString(req.to);
  if (!from || !to) {
    return { ok: false, outcome: "MISSING_DATE_RANGE", retryable: false, failure: "from and to are required" };
  }
  const emailAccountIds = asIdList(req.emailAccountIds);
  const body = { from, to };
  if (emailAccountIds.length) body.emailAccountIds = emailAccountIds;
  const classified = classifyHttp(await trulyinboxRequestRaw("/reports/export", "POST", body));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified);
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "EXPORT_FAILED",
      retryable: false,
      failure: classified.message || `Report export failed (${classified.status})`,
    };
  }
  const jobId = asString(classified.body.jobId);
  if (!jobId) {
    return { ok: false, outcome: "EXPORT_UNPROVEN", retryable: false, failure: "Export response omitted jobId" };
  }
  return {
    ok: true,
    outcome: "EXPORT_QUEUED",
    retryable: false,
    jobId,
    status: asString(classified.body.status) || "queued",
    failure: "",
  };
}
