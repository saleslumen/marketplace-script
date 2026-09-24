/**
 * @description List InboxKit domains for a workspace (paginated).
 * @param {Object} input
 * @param {string} input.workspaceId
 * @returns {Object}
 */
async function listDomains(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", domains: [], failure: "workspaceId is required" };
  }
  const allPages = !(req.allPages === false || asString(req.allPages).toLowerCase() === "false");
  const limit = asNumber(req.limit, 50);
  let page = asNumber(req.page, 1);
  const domains = [];
  let total = 0;
  let pages = 1;
  const maxPages = allPages ? 50 : 1;
  for (let i = 0; i < maxPages; i += 1) {
    const body = { page, limit };
    if (asString(req.keywords || req.keyword)) body.keywords = asString(req.keywords || req.keyword);
    const statuses = parseJsonArray(req.status || req.statuses);
    if (statuses.length) body.status = statuses;
    const response = await inboxKitRequest("/v1/api/domains/list", "POST", body, workspaceId);
    if (response.error) {
      return {
        ok: false,
        outcome: "LIST_FAILED",
        domains,
        failure: asString(response.message) || "list domains failed",
      };
    }
    const pageRows = (response.domains || []).map(mapInboxKitDomain).filter((row) => row.uid || row.name);
    domains.push(...pageRows);
    total = Number(response.total || domains.length) || domains.length;
    pages = Number(response.pages || 1) || 1;
    if (!allPages) break;
    if (page >= pages) break;
    if (!pageRows.length) break;
    page += 1;
  }
  return {
    ok: true,
    outcome: "LISTED",
    workspaceId,
    domains,
    total: total || domains.length,
    pages,
    failure: "",
  };
}
