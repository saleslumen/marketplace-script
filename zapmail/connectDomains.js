/**
 * @description Connect domains to Zapmail (CloudNS). Caller must already point NS at Zapmail nameservers.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} input.domains
 * @returns {Object}
 */
async function connectDomains(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domains = asCsvList(req.domains || req.domainNames).map((domain) => domain.toLowerCase());
  if (!workspaceId) throw new Error("ZAPMAIL_REQUEST_FAILED: workspaceId is required");
  if (!domains.length) throw new Error("ZAPMAIL_REQUEST_FAILED: domains is required");
  const response = await zapmailRequest("/v2/domains/connect-domain", "POST", { domainNames: domains }, workspaceId);
  const data = response.data || {};
  const perDomain = data.domains && typeof data.domains === "object" ? data.domains : {};
  const results = domains.map((domainName) => {
    const row = perDomain[domainName] || {};
    return {
      domainName,
      status: asString(row.status),
      dnsManagedBy: asString(row.dnsManagedBy),
    };
  });
  return {
    status: asString(data.status),
    results,
    nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
  };
}
