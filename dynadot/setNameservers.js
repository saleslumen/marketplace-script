/**
 * @description Set nameservers via official API3 add_ns (missing hosts) then set_ns (ns0–ns12).
 * Caller-supplied hostnames must be in the account; add_ns adds them first. register_ns (glue) is not called.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @param {string|string[]} input.nameservers
 * @returns {Object}
 */
async function setNameservers(input) {
  const domains = asCsvList(input && input.domains).map((name) => name.toLowerCase());
  const nameservers = asCsvList(input && (input.nameservers || input.nameServers || input.name_server_list));
  if (!domains.length) throw new Error("DYNADOT_REQUEST_FAILED: domains is required");
  if (!nameservers.length) throw new Error("DYNADOT_REQUEST_FAILED: nameservers is required");
  if (nameservers.length > 13) throw new Error("DYNADOT_REQUEST_FAILED: API3 set_ns accepts ns0 through ns12");
  const ensured = await ensureAccountNameservers(nameservers);
  if (!ensured.ok) throw new Error(`DYNADOT_REQUEST_FAILED (${ensured.status}): ${ensured.failure}`);
  const updated = [];
  for (const domain of domains) {
    const raw = await dynadotApi3Raw("set_ns", setNsParams(domain, nameservers));
    const classified = classifiedApi3(raw, "NAMESERVERS_SET", "NAMESERVER_FAILED");
    if (!classified.ok) throw new Error(`DYNADOT_REQUEST_FAILED (${classified.status}): ${classified.failure}`);
    updated.push(domain);
  }
  return { updated, nameservers, ok: true, outcome: "NAMESERVERS_SET", failure: "" };
}
