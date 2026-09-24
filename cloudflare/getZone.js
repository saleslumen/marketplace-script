/**
 * @description Get one zone by id, including nameservers and status.
 * @param {Object} input
 * @param {string} input.zoneId
 * @param {string} input.accountId
 * @returns {Object}
 */
async function getZone(input) {
  const zoneId = asString(input && input.zoneId);
  const accountId = asString(input && (input.accountId || input.cloudflareAccountId));
  if (!zoneId) throw new Error("CLOUDFLARE_REQUEST_FAILED: zoneId is required");
  if (!accountId) throw new Error("CLOUDFLARE_ACCOUNT_ID_MISSING: accountId is required");
  const result = await cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}`, "GET", undefined, accountId);
  return {
    zoneId: asString(result.id),
    domain: asString(result.name),
    nameServers: Array.isArray(result.name_servers) ? result.name_servers.map(asString).filter(Boolean) : [],
    status: asString(result.status),
    accountId,
  };
}
