/**
 * @description Set custom nameservers on domains.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @param {string|string[]} input.nameservers
 * @returns {Object}
 * @property {string[]} updated
 */
async function setNameservers(input) {
  const domains = asCsvList(input && input.domains);
  const nameservers = asCsvList(input && input.nameservers);
  if (!domains.length) throw new Error("SPACESHIP_REQUEST_FAILED: domains is required");
  if (!nameservers.length) throw new Error("SPACESHIP_REQUEST_FAILED: nameservers is required");
  const updated = [];
  for (const domain of domains) {
    const raw = await spaceshipRequestRaw(`/domains/${encodeURIComponent(domain)}/nameservers`, "PUT", {
      nameservers,
    });
    if (raw.status === 202 || raw.operationId) {
      const polled = await pollAsyncOperation(raw.operationId);
      if (polled.status !== "success") {
        throw new Error(`SPACESHIP_REQUEST_FAILED: nameserver update ${polled.status} for ${domain}: ${polled.failure}`);
      }
    } else if (raw.status < 200 || raw.status >= 300) {
      throw new Error(`SPACESHIP_REQUEST_FAILED (${raw.status}): ${raw.text}`);
    }
    updated.push(domain);
  }
  return { updated, nameservers, ok: true, outcome: "NAMESERVERS_SET", failure: "" };
}
