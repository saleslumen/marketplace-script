/**
 * @description Delete all dns_conflict matches returned by InboxKit connect for one or more domains.
 * @param {Object} input
 * @param {string} input.accountId
 * @param {Object[]|string} input.conflicts - [{ domain|zone_name, records:[{type,host}] }]
 * @returns {Object}
 */
async function cleanupDnsConflicts(input) {
  const req = input && typeof input === "object" ? input : {};
  const accountId = asString(req.accountId || req.cloudflareAccountId);
  let conflicts = req.conflicts || req.dnsConflicts || [];
  if (typeof conflicts === "string") {
    try {
      conflicts = JSON.parse(conflicts);
    } catch (_error) {
      conflicts = [];
    }
  }
  if (!accountId) {
    return { ok: false, outcome: "MISSING_ACCOUNT", results: [], failure: "accountId is required" };
  }
  if (!Array.isArray(conflicts) || !conflicts.length) {
    return { ok: true, outcome: "NO_CONFLICTS", results: [], deletedCount: 0, failure: "" };
  }
  const results = [];
  let deletedCount = 0;
  const failed = [];
  for (const conflict of conflicts) {
    const domain = asString(conflict && (conflict.domain || conflict.zone_name || conflict.name));
    const matches = (conflict && (conflict.records || conflict.matches)) || [];
    if (!domain || !Array.isArray(matches) || !matches.length) {
      failed.push({ domain, failure: "conflict domain and records required" });
      continue;
    }
    const cleaned = await deleteDnsRecordsByMatch({ accountId, domain, matches });
    results.push({ domain, ...cleaned });
    deletedCount += Number(cleaned.deletedCount || 0) || 0;
    if (!cleaned.ok && asString(cleaned.outcome) !== "NO_MATCHES") {
      failed.push({ domain, failure: cleaned.failure || cleaned.outcome });
    }
  }
  const ok = failed.length === 0;
  return {
    ok,
    outcome: ok ? "CONFLICTS_CLEARED" : "CONFLICT_CLEANUP_FAILED",
    accountId,
    results,
    deletedCount,
    failed,
    failure: ok ? "" : failed.map((row) => `${row.domain}: ${row.failure}`).join("; "),
  };
}
