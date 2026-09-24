/**
 * @description List Zapmail domains in a workspace.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} [input.contains]
 * @returns {Object}
 */
async function listDomains(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  if (!workspaceId) throw new Error("ZAPMAIL_REQUEST_FAILED: workspaceId is required");
  const domains = [];
  let page = 1;
  for (let i = 0; i < 50; i += 1) {
    const params = [`page=${page}`, "limit=50"];
    if (asString(req.contains)) params.push(`contains=${encodeURIComponent(asString(req.contains))}`);
    const response = await zapmailRequest(`/v2/domains?${params.join("&")}`, "GET", undefined, workspaceId);
    const data = response.data || {};
    (data.domains || []).forEach((domain) => {
      domains.push({
        domainId: asString(domain.id),
        domainName: asString(domain.domain).toLowerCase(),
        status: asString(domain.status),
        nameServers: Array.isArray(domain.nameServers) ? domain.nameServers.map(asString) : [],
      });
    });
    const totalPages = asNumber(data.totalPages, 1);
    if (page >= totalPages) break;
    page += 1;
  }
  return { domains, count: domains.length };
}
