/**
 * @description Set per-zone nameservers: API3 add_ns for missing hosts, set_ns, then get_ns read-back.
 * ok only when every zone is updated and expected NS ⊆ read-back actual.
 * Empty/lag/unparseable read-back → NAMESERVER_READBACK_PENDING; permanent API → FAILED.
 * @param {Object} input
 * @param {Object[]|string} input.zones - [{ domain, nameServers }]
 * @returns {Object}
 */
async function setNameserversForZones(input) {
  const req = input && typeof input === "object" ? input : {};
  const zones = asZoneList(req.zones);
  if (!zones.length) {
    return { ok: false, outcome: "MISSING_ZONES", updated: [], pending: [], failed: [], results: [], failure: "zones is required" };
  }
  const updated = [];
  const pending = [];
  const failed = [];
  const results = [];
  for (const zone of zones) {
    const domain = asString(zone.domain || zone.name).toLowerCase();
    const nameservers = asCsvList(zone.nameServers || zone.nameservers || zone.name_servers || zone.name_server_list);
    if (!domain) {
      failed.push({ domain: "", failure: "zone domain missing" });
      results.push({ domain: "", ok: false, outcome: "MISSING_DOMAIN", failure: "zone domain missing" });
      continue;
    }
    if (!nameservers.length) {
      failed.push({ domain, failure: "zone nameServers missing" });
      results.push({ domain, ok: false, outcome: "MISSING_NAMESERVERS", failure: "zone nameServers missing" });
      continue;
    }
    if (nameservers.length > 13) {
      failed.push({ domain, failure: "API3 set_ns accepts ns0 through ns12" });
      results.push({ domain, ok: false, outcome: "NAMESERVER_FAILED", nameservers, failure: "API3 set_ns accepts ns0 through ns12" });
      continue;
    }
    try {
      const ensured = await ensureAccountNameservers(nameservers);
      if (!ensured.ok) {
        failed.push({ domain, failure: ensured.failure || "add_ns failed" });
        results.push({ domain, ok: false, outcome: "NAMESERVER_FAILED", nameservers, failure: ensured.failure });
        continue;
      }
      const raw = await dynadotApi3Raw("set_ns", setNsParams(domain, nameservers));
      const classified = classifiedApi3(raw, "NAMESERVERS_SET", "NAMESERVER_FAILED");
      if (!classified.ok) {
        failed.push({ domain, failure: classified.failure || `nameserver update failed (${classified.status})` });
        results.push({ domain, ok: false, outcome: classified.outcome === "UNAUTHORIZED" ? "NAMESERVER_FAILED" : classified.outcome, nameservers, failure: classified.failure });
        continue;
      }
    } catch (error) {
      const message = asString(error && error.message) || "nameserver update failed";
      failed.push({ domain, failure: message });
      results.push({ domain, ok: false, outcome: "NAMESERVER_FAILED", nameservers, failure: message });
      continue;
    }
    let readBack;
    try {
      readBack = await readBackNameservers(domain);
    } catch (error) {
      const message = asString(error && error.message) || "NS read-back failed";
      if (isPermanentNameserverApiError(error) || isPermanentNameserverApiError(message)) {
        failed.push({ domain, failure: message });
        results.push({ domain, ok: false, outcome: "NAMESERVER_FAILED", nameservers, readBackNameservers: [], failure: message });
      } else {
        pending.push(domain);
        results.push({ domain, ok: false, outcome: "NAMESERVER_READBACK_PENDING", nameservers, readBackNameservers: [], failure: message });
      }
      continue;
    }
    const verdict = evaluateNameserverReadBack(readBack, nameservers);
    if (verdict.kind === "failed") {
      failed.push({ domain, failure: verdict.failure });
      results.push({ domain, ok: false, outcome: verdict.outcome, nameservers, readBackNameservers: readBack.nameservers || [], failure: verdict.failure });
      continue;
    }
    if (verdict.kind === "pending") {
      pending.push(domain);
      results.push({ domain, ok: false, outcome: "NAMESERVER_READBACK_PENDING", nameservers, readBackNameservers: readBack.nameservers || [], failure: verdict.failure });
      continue;
    }
    updated.push(domain);
    results.push({ domain, ok: true, outcome: "NAMESERVERS_SET", nameservers, readBackNameservers: readBack.nameservers || [], failure: "" });
  }
  const ok = updated.length === zones.length && failed.length === 0 && pending.length === 0;
  let outcome = "NAMESERVERS_SET";
  if (!ok) {
    if (failed.length) outcome = "NAMESERVER_PARTIAL_FAILED";
    else outcome = "NAMESERVER_PENDING";
  }
  return {
    ok,
    outcome,
    retryable: !ok && failed.length === 0 && pending.length > 0,
    updated,
    pending,
    failed,
    results,
    expectedCount: zones.length,
    updatedCount: updated.length,
    failure: ok ? "" : `updated=${updated.length} pending=${pending.length} failed=${failed.length}`,
  };
}
