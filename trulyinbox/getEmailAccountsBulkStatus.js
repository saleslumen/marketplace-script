/**
 * @description Get status for up to 50 email accounts. Results stay in input order.
 * @param {Object} input
 * @param {string|string[]|number[]} input.emailAccountIds
 * @returns {Object}
 */
async function getEmailAccountsBulkStatus(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountIds = asIdList(req.emailAccountIds);
  if (!emailAccountIds.length) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, results: [], failure: "emailAccountIds is required" };
  }
  if (emailAccountIds.length > 50) {
    return { ok: false, outcome: "BULK_STATUS_LIMIT", retryable: false, results: [], failure: "emailAccountIds is limited to 50 accounts" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw("/email-accounts/bulk-status", "POST", { emailAccountIds }));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { results: [] });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "BULK_STATUS_FAILED",
      retryable: false,
      results: [],
      failure: classified.message || `Bulk status failed (${classified.status})`,
    };
  }
  const results = (Array.isArray(classified.body.results) ? classified.body.results : []).map(mapAccountStatus);
  return { ok: true, outcome: "BULK_STATUS", retryable: false, results, failure: "" };
}
