/**
 * @description Set per-zone Spaceship nameservers and aggregate outcomes (no throw mid-loop for workflow registry gating).
 * SUCCEEDED (ok) only when every requested zone domain is updated and expected NS ⊆ read-back actual.
 * Empty/lag/unparseable read-back → NAMESERVER_READBACK_PENDING (retryable); permanent API → FAILED.
 * @param {Object} input
 * @param {Object[]|string} input.zones - [{ domain, nameServers }] from Cloudflare createZones
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
    try {
      const raw = await spaceshipRequestRaw(`/domains/${encodeURIComponent(domain)}/nameservers`, "PUT", {
        nameservers,
      });
      if (raw.status === 202 || raw.operationId) {
        const polled = await pollAsyncOperation(raw.operationId);
        if (polled.status === "pending") {
          pending.push(domain);
          results.push({ domain, ok: false, outcome: "NAMESERVER_PENDING", nameservers, failure: polled.failure });
          continue;
        }
        if (polled.status !== "success") {
          failed.push({ domain, failure: polled.failure || "nameserver async failed" });
          results.push({ domain, ok: false, outcome: "NAMESERVER_FAILED", nameservers, failure: polled.failure });
          continue;
        }
      } else if (raw.status < 200 || raw.status >= 300) {
        failed.push({ domain, failure: `nameserver update failed (${raw.status}): ${raw.text}` });
        results.push({ domain, ok: false, outcome: "NAMESERVER_FAILED", nameservers, failure: raw.text });
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
        results.push({
          domain,
          ok: false,
          outcome: "NAMESERVER_FAILED",
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
    failure: ok
      ? ""
      : `updated=${updated.length} pending=${pending.length} failed=${failed.length}`,
  };
}
