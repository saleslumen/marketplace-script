/**
 * @description Delete DNS records matching type+host pairs (InboxKit dns_conflict cleanup). Not for Google DKIM/DMARC authorship.
 * @param {Object} input
 * @param {string} input.accountId
 * @param {string} [input.zoneId]
 * @param {string} [input.domain]
 * @param {Object[]|string} input.matches - [{ type, host|name }] or JSON string
 * @returns {Object}
 */
async function deleteDnsRecordsByMatch(input) {
  const req = input && typeof input === "object" ? input : {};
  const accountId = asString(req.accountId || req.cloudflareAccountId);
  if (!accountId) {
    return { ok: false, outcome: "MISSING_ACCOUNT", deleted: [], failure: "accountId is required" };
  }
  let matches = req.matches || req.records || [];
  if (typeof matches === "string") {
    try {
      matches = JSON.parse(matches);
    } catch (_error) {
      matches = [];
    }
  }
  if (!Array.isArray(matches) || !matches.length) {
    return { ok: false, outcome: "MISSING_MATCHES", deleted: [], failure: "matches is required" };
  }
  let zoneId = asString(req.zoneId);
  let zoneName = asString(req.domain || req.zoneName);
  if (!zoneId) {
    if (!zoneName) {
      return { ok: false, outcome: "MISSING_ZONE", deleted: [], failure: "zoneId or domain is required" };
    }
    const existing = await findExistingZone(zoneName, accountId);
    if (!existing) {
      return { ok: false, outcome: "ZONE_NOT_FOUND", deleted: [], failure: `No zone for ${zoneName}` };
    }
    zoneId = asString(existing.id);
    zoneName = asString(existing.name || zoneName);
  } else if (!zoneName) {
    try {
      const zone = await getZone({ zoneId, accountId });
      zoneName = asString(zone.domain);
    } catch (_error) {
      zoneName = "";
    }
  }
  const listed = await listDnsRecords({ accountId, zoneId, domain: zoneName });
  if (!listed.ok) {
    return { ok: false, outcome: listed.outcome, deleted: [], failure: listed.failure };
  }
  const wanted = matches.map((row) => ({
    type: asString(row && (row.type || row.recordType)).toUpperCase(),
    host: normalizeDnsHost(row && (row.host || row.name), zoneName),
  })).filter((row) => row.type && row.host);
  const deleted = [];
  const failed = [];
  for (const record of listed.records || []) {
    const name = asString(record.name).toLowerCase();
    const type = asString(record.type).toUpperCase();
    const hit = wanted.some((row) => row.type === type && row.host === name);
    if (!hit) continue;
    try {
      await cloudflareRequest(
        `/zones/${encodeURIComponent(zoneId)}/dns_records/${encodeURIComponent(record.id)}`,
        "DELETE",
        undefined,
        accountId,
      );
      deleted.push({ id: record.id, type, name, content: asString(record.content) });
    } catch (error) {
      failed.push({ id: record.id, type, name, failure: asString(error.message || error) });
    }
  }
  const ok = failed.length === 0;
  return {
    ok,
    outcome: ok ? (deleted.length ? "DELETED" : "NO_MATCHES") : "DELETE_PARTIAL",
    accountId,
    zoneId,
    zoneName,
    deleted,
    deletedCount: deleted.length,
    failed,
    failure: ok ? "" : failed.map((row) => `${row.type} ${row.name}: ${row.failure}`).join("; "),
  };
}
