/**
 * @description Check availability via official REST GET /restful/v2/domains/{domain_name}/search.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @returns {Object}
 */
async function checkAvailability(input) {
  const domains = asCsvList(input && input.domains).map((name) => name.toLowerCase());
  if (!domains.length) throw new Error("DYNADOT_REQUEST_FAILED: domains is required");
  const results = [];
  const available = [];
  for (const domain of domains) {
    const searched = await searchOneDomain(domain);
    if (!searched.classified.ok) {
      return {
        ok: false,
        outcome: searched.classified.outcome,
        retryable: searched.classified.retryable,
        failure: searched.classified.failure,
        status: searched.classified.status,
        available: [],
        results,
        domains,
      };
    }
    results.push(searched.row);
    if (searched.row.available) available.push(searched.row.domain);
  }
  return { available, results, domains, ok: true, outcome: "AVAILABLE", failure: "" };
}
