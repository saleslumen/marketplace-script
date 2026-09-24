/**
 * @description Get one owned domain via official API3 GET /api3.json?command=domain_info.
 * @param {Object} input
 * @param {string} input.domain
 * @returns {Object}
 */
async function getDomain(input) {
  const domain = asString(input && (input.domain || input.name)).toLowerCase();
  if (!domain) throw new Error("DYNADOT_REQUEST_FAILED: domain is required");
  try {
    const ownership = await getOwnedDomain(domain);
    return { domain, owned: ownership.owned, detail: ownership.detail, failure: ownership.failure || "", ok: ownership.owned, outcome: ownership.owned ? "DOMAIN" : "NOT_OWNED" };
  } catch (error) {
    return {
      ok: false,
      outcome: error && error.outcome ? error.outcome : "DOMAIN_FAILED",
      retryable: Boolean(error && error.retryable),
      failure: asString(error && error.message) || "get domain failed",
      status: error && error.status,
      domain,
      owned: false,
      detail: null,
    };
  }
}
