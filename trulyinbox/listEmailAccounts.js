/**
 * @description List connected email accounts. Uses only documented query fields (search, sort, sortBy, status, tags).
 * @param {Object} input
 * @param {string} [input.search]
 * @param {string} [input.sort]
 * @param {string} [input.sortBy]
 * @param {string} [input.status]
 * @param {string|string[]} [input.tags]
 * @param {string} [input.workspaceId] - Client-side filter when items include workspaceId.
 * @returns {Object}
 */
async function listEmailAccounts(input) {
  const req = input && typeof input === "object" ? input : {};
  const tags = asCsvList(req.tags || req.tagName);
  const workspaceId = asString(req.workspaceId || req.trulyInboxWorkspaceId);
  const query = buildQuery({
    search: asString(req.search),
    sort: asString(req.sort),
    sortBy: asString(req.sortBy),
    status: asString(req.status),
    tags,
  });
  const classified = classifyHttp(await trulyinboxRequestRaw(`/email-accounts${query}`, "GET"));
  if (classified.status === 429 || classified.retryable) {
    return { ok: false, outcome: "RATE_LIMITED", retryable: true, items: [], failure: classified.message || "TrulyInbox rate limited (20 req/min)" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "LIST_FAILED",
      retryable: false,
      items: [],
      failure: classified.message || `List email accounts failed (${classified.status})`,
    };
  }
  const items = (Array.isArray(classified.body.items) ? classified.body.items : [])
    .map(mapEmailAccount)
    .filter((row) => row.emailAccountId && row.fromEmail)
    .filter((row) => workspaceMatches(row.workspaceId, workspaceId));
  const total = asNumber(classified.body.total, items.length);
  const truncated = Number.isFinite(total) && total > (Array.isArray(classified.body.items) ? classified.body.items.length : items.length);
  return {
    ok: true,
    outcome: truncated ? "LIST_INCOMPLETE" : "LISTED",
    retryable: false,
    items,
    total,
    page: asNumber(classified.body.page, 1),
    limit: asNumber(classified.body.limit, items.length),
    totalPages: asNumber(classified.body.totalPages, 1),
    truncated,
    failure: truncated
      ? "List page is incomplete and page/limit query parameters are not documented"
      : "",
  };
}
