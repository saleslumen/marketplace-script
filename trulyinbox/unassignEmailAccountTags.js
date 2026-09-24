/**
 * @description Unassign tags from email accounts. Unknown or unassigned names are ignored.
 * @param {Object} input
 * @param {string|string[]|number[]} input.emailAccountIds
 * @param {string|string[]} input.tags
 * @returns {Object}
 */
async function unassignEmailAccountTags(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountIds = asIdList(req.emailAccountIds);
  const tags = asCsvList(req.tags);
  if (!emailAccountIds.length || !tags.length) {
    return { ok: false, outcome: "MISSING_TAGS", retryable: false, items: [], failure: "emailAccountIds and tags are required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw("/email-accounts/tags/unassign", "POST", { emailAccountIds, tags }));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { items: [] });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "TAGS_UNASSIGN_FAILED",
      retryable: false,
      items: [],
      failure: classified.message || `Unassign tags failed (${classified.status})`,
    };
  }
  const items = (Array.isArray(classified.body) ? classified.body : []).map(mapEmailAccount).filter((row) => row.emailAccountId);
  return { ok: true, outcome: "TAGS_UNASSIGNED", retryable: false, items, failure: "" };
}
