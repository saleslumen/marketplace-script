/**
 * @description Get-or-create full DNS zones and return assigned nameservers per domain (idempotent).
 * Lists existing zones by name+account before create. Uses the Cloudflare API token connection. The account id stays an operation argument.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @param {string} input.accountId - Cloudflare account id
 * @returns {Object}
 * @property {boolean} ok
 * @property {Object[]} zones - [{ domain, zoneId, nameServers, status, existing }]
 */
async function createZones(input) {
  const req = input && typeof input === "object" ? input : {};
  const domains = asCsvList(req.domains);
  const accountId = asString(req.accountId || req.cloudflareAccountId);
  if (!domains.length) {
    return { ok: false, outcome: "MISSING_DOMAINS", zones: [], count: 0, failure: "domains is required" };
  }
  if (!accountId) {
    return { ok: false, outcome: "MISSING_ACCOUNT", zones: [], count: 0, failure: "accountId is required" };
  }
  const zones = [];
  const failed = [];
  for (const name of domains) {
    try {
      const existing = await findExistingZone(name, accountId);
      if (existing) {
        const mapped = mapZone(existing, name);
        mapped.existing = true;
        zones.push(mapped);
        continue;
      }
      const result = await cloudflareRequest("/zones", "POST", {
        name,
        type: "full",
        account: { id: accountId },
      }, accountId);
      zones.push(mapZone(result, name));
    } catch (error) {
      failed.push({ domain: name, failure: asString(error.message || error) });
    }
  }
  const ok = failed.length === 0 && zones.length === domains.length;
  return {
    ok,
    outcome: ok ? "ZONES_READY" : "ZONES_INCOMPLETE",
    accountId,
    zones,
    count: zones.length,
    failed,
    failure: ok ? "" : failed.map((row) => `${row.domain}: ${row.failure}`).join("; "),
  };
}
