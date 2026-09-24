/**
 * @description Set per-zone Namecheap nameservers and aggregate outcomes (no throw mid-loop).
 * Prefer API-derived SLD/TLD (getTldList / owned metadata); require explicit sld/tld when unresolved.
 * SUCCEEDED (ok) only when every requested zone is updated and expected NS ⊆ read-back actual.
 * Empty/lag/unparseable read-back → NAMESERVER_READBACK_PENDING (retryable); permanent API → FAILED.
 * @param {Object} input
 * @param {Object[]|string} input.zones - [{ domain, nameServers, sld?, tld? }]
 * @returns {Object}
 */
async function setNameserversForZones(input) {
  const req = input && typeof input === "object" ? input : {};
  const zones = asZoneList(req.zones);
  if (!zones.length) {
    return {
      ok: false,
      outcome: "MISSING_ZONES",
      updated: [],
      pending: [],
      failed: [],
      results: [],
      failure: "zones is required",
    };
  }
  const updated = [];
  const pending = [];
  const failed = [];
  const results = [];
  for (const zone of zones) {
    const domain = asString(zone.domain || zone.name).toLowerCase();
    const nameservers = asCsvList(zone.nameServers || zone.nameservers || zone.name_servers);
    const explicitSld = asString(zone.sld || zone.SLD);
    const explicitTld = asString(zone.tld || zone.TLD);
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
    let split = null;
    try {
      split = await resolveSldTld({ domain, sld: explicitSld, tld: explicitTld });
      if (!split.ok) {
        failed.push({ domain, failure: split.failure });
        results.push({ domain, ok: false, outcome: "SLD_TLD_UNRESOLVED", failure: split.failure });
        continue;
      }
      const response = await namecheapRequest("namecheap.domains.dns.setCustom", {
        SLD: split.sld,
        TLD: split.tld,
        Nameservers: nameservers.join(","),
      }, { method: "POST" });
      const result = response.commandResponse && response.commandResponse.DomainDNSSetCustomResult;
      const attrs = attributeMap(result);
      if (attrs.Updated && !asBoolean(attrs.Updated, true)) {
        failed.push({ domain, failure: "setCustom Updated=false" });
        results.push({ domain, ok: false, outcome: "NAMESERVER_FAILED", nameservers, failure: "setCustom Updated=false" });
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
      readBack = await readBackNameservers(domain, split.sld, split.tld);
    } catch (error) {
      const message = asString(error && error.message) || "NS read-back failed";
      if (isPermanentNameserverApiError(error) || isPermanentNameserverApiError(message)) {
        failed.push({ domain, failure: message });
        results.push({
          domain,
          ok: false,
          outcome: "NAMESERVER_FAILED",
          sld: split.sld,
          tld: split.tld,
          nameservers,
          readBackNameservers: [],
          failure: message,
        });
      } else {
        pending.push(domain);
        results.push({
          domain,
          ok: false,
          outcome: "NAMESERVER_READBACK_PENDING",
          sld: split.sld,
          tld: split.tld,
          nameservers,
          readBackNameservers: [],
          failure: message,
        });
      }
      continue;
    }
    const verdict = evaluateNameserverReadBack(readBack, nameservers);
    if (verdict.kind === "failed") {
      failed.push({ domain, failure: verdict.failure });
      results.push({
        domain,
        ok: false,
        outcome: verdict.outcome,
        sld: split.sld,
        tld: split.tld,
        nameservers,
        readBackNameservers: readBack.nameservers || [],
        failure: verdict.failure,
      });
      continue;
    }
    if (verdict.kind === "pending") {
      pending.push(domain);
      results.push({
        domain,
        ok: false,
        outcome: "NAMESERVER_READBACK_PENDING",
        sld: split.sld,
        tld: split.tld,
        nameservers,
        readBackNameservers: readBack.nameservers || [],
        failure: verdict.failure,
      });
      continue;
    }
    updated.push(domain);
    results.push({
      domain,
      ok: true,
      outcome: "NAMESERVERS_SET",
      sld: split.sld,
      tld: split.tld,
      nameservers,
      readBackNameservers: readBack.nameservers || [],
      failure: "",
    });
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
