/**
 * @description List DNS records for a zone (optional type/name filters).
 * @param {Object} input
 * @param {string} input.accountId
 * @param {string} [input.zoneId]
 * @param {string} [input.domain] - Resolve zone by name when zoneId omitted
 * @param {string} [input.type]
 * @param {string} [input.name]
 * @returns {Object}
 */
async function listDnsRecords(input) {
  const req = input && typeof input === "object" ? input : {};
  const accountId = asString(req.accountId || req.cloudflareAccountId);
  if (!accountId) {
    return { ok: false, outcome: "MISSING_ACCOUNT", records: [], failure: "accountId is required" };
  }
  let zoneId = asString(req.zoneId);
  let zoneName = asString(req.domain || req.zoneName);
  if (!zoneId) {
    if (!zoneName) {
      return { ok: false, outcome: "MISSING_ZONE", records: [], failure: "zoneId or domain is required" };
    }
    const existing = await findExistingZone(zoneName, accountId);
    if (!existing) {
      return { ok: false, outcome: "ZONE_NOT_FOUND", records: [], failure: `No zone for ${zoneName}` };
    }
    zoneId = asString(existing.id);
    zoneName = asString(existing.name || zoneName);
  }
  const params = ["per_page=100"];
  if (asString(req.type)) params.push(`type=${encodeURIComponent(asString(req.type))}`);
  if (asString(req.name)) params.push(`name=${encodeURIComponent(normalizeDnsHost(req.name, zoneName))}`);
  const result = await cloudflareRequest(
    `/zones/${encodeURIComponent(zoneId)}/dns_records?${params.join("&")}`,
    "GET",
    undefined,
    accountId,
  );
  const rows = Array.isArray(result) ? result : [];
  const records = rows.map((row) => ({
    id: asString(row.id),
    type: asString(row.type),
    name: asString(row.name),
    content: asString(row.content),
    ttl: row.ttl,
    proxied: row.proxied === true,
    priority: row.priority,
  }));
  return { ok: true, outcome: "LISTED", accountId, zoneId, zoneName, records, count: records.length, failure: "" };
}
