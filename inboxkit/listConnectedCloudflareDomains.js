/**
 * @description List Cloudflare-connected domains for a workspace (paginated).
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|boolean} [input.allPages]
 * @returns {Object}
 */
async function listConnectedCloudflareDomains(input) {
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
    const query = [`page=${page}`, `limit=${limit}`];
    if (asString(req.keyword)) query.push(`keyword=${encodeURIComponent(asString(req.keyword))}`);
    const response = await inboxKitRequest(`/v1/api/cloudflare-domains/list?${query.join("&")}`, "GET", undefined, workspaceId);
    if (response.error) {
      return {
        ok: false,
        outcome: "LIST_FAILED",
        domains,
        failure: asString(response.message) || "list connected Cloudflare domains failed",
      };
    }
    const pageRows = (response.domains || []).map(mapConnectedCloudflareDomain).filter((row) => row.name);
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
