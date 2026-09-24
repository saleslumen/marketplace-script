/**
 * @description Permanently delete up to 20 email accounts.
 * @param {Object} input
 * @param {string|string[]|number[]} input.emailAccountIds
 * @returns {Object}
 */
async function deleteEmailAccountsBulk(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountIds = asIdList(req.emailAccountIds);
  if (!emailAccountIds.length) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, results: [], failure: "emailAccountIds is required" };
  }
  if (emailAccountIds.length > 20) {
    return { ok: false, outcome: "BULK_DELETE_LIMIT", retryable: false, results: [], failure: "emailAccountIds is limited to 20 accounts" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw("/email-accounts/bulk-delete", "POST", { emailAccountIds }));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { results: [] });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "BULK_DELETE_FAILED",
      retryable: false,
      results: [],
      failure: classified.message || `Bulk delete failed (${classified.status})`,
    };
  }
  const results = (Array.isArray(classified.body.results) ? classified.body.results : []).map(mapBulkDeleteResult);
  return { ok: true, outcome: "BULK_DELETED", retryable: false, results, failure: "" };
}
