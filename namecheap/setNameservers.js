/**
 * @description Set custom nameservers on domains (domains.dns.setCustom) with correct SLD/TLD.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @param {string|string[]} input.nameservers
 * @param {string} [input.sld]
 * @param {string} [input.tld]
 * @returns {Object}
 */
async function setNameservers(input) {
  const domains = asCsvList(input && input.domains);
  const nameservers = asCsvList(input && input.nameservers);
  const explicitSld = asString(input && (input.sld || input.SLD));
  const explicitTld = asString(input && (input.tld || input.TLD));
  if (!domains.length) throw new Error("NAMECHEAP_REQUEST_FAILED: domains is required");
  if (!nameservers.length) throw new Error("NAMECHEAP_REQUEST_FAILED: nameservers is required");
  const updated = [];
  for (const domain of domains) {
    const split = await resolveSldTld({ domain, sld: explicitSld, tld: explicitTld });
    if (!split.ok) throw new Error(`NAMECHEAP_REQUEST_FAILED: ${split.failure}`);
    await namecheapRequest("namecheap.domains.dns.setCustom", {
      SLD: split.sld,
      TLD: split.tld,
      Nameservers: nameservers.join(","),
    }, { method: "POST" });
    updated.push(domain.toLowerCase());
  }
  return { updated, nameservers, ok: true, outcome: "NAMESERVERS_SET", failure: "" };
}
