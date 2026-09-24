/**
 * @description Resolve zones for the full domain set and require every zone status=active.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @param {string} input.accountId
 * @returns {Object}
 */
async function ensureZonesActive(input) {
  const req = input && typeof input === "object" ? input : {};
  const domains = asCsvList(req.domains);
  const accountId = asString(req.accountId || req.cloudflareAccountId);
  if (!domains.length) {
    return { ok: false, outcome: "MISSING_DOMAINS", retryable: false, zones: [], failure: "domains is required" };
  }
  if (!accountId) {
    return { ok: false, outcome: "MISSING_ACCOUNT", retryable: false, zones: [], failure: "accountId is required" };
  }
  const zones = [];
  const missing = [];
  const pending = [];
  const failed = [];
  for (const name of domains) {
    try {
      const existing = await findExistingZone(name, accountId);
      if (!existing) {
        missing.push(name);
        continue;
      }
      const mapped = mapZone(existing, name);
      mapped.existing = true;
      zones.push(mapped);
      if (asString(mapped.status).toLowerCase() !== "active") pending.push(mapped);
    } catch (error) {
      failed.push({ domain: name, failure: asString(error.message || error) });
    }
  }
  if (failed.length) {
    return {
      ok: false,
      outcome: "ZONES_LOOKUP_FAILED",
      retryable: true,
      accountId,
      zones,
      missing,
      pending,
      failed,
      failure: failed.map((row) => `${row.domain}: ${row.failure}`).join("; "),
    };
  }
  if (missing.length) {
    return {
      ok: false,
      outcome: "ZONES_MISSING",
      retryable: false,
      accountId,
      zones,
      missing,
      pending,
      failed: [],
      failure: `Missing Cloudflare zones: ${missing.join(", ")}`,
    };
  }
  if (pending.length || zones.length !== domains.length) {
    return {
      ok: false,
      outcome: "ZONES_NOT_ACTIVE",
      retryable: true,
      accountId,
      zones,
      missing: [],
      pending,
      failed: [],
      failure: pending.map((row) => `${row.domain}:${row.status || "pending"}`).join("; ") || "Zones not active",
    };
  }
  return {
    ok: true,
    outcome: "ZONES_ACTIVE",
    retryable: false,
    accountId,
    zones,
    missing: [],
    pending: [],
    failed: [],
    failure: "",
  };
}
