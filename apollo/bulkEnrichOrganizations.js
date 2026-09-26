/**
 * @description Bulk organization enrichment. POST /organizations/bulk_enrich. https://docs.apollo.io/reference/bulk-organization-enrichment
 * @param {Object} input
 * @param {string[]} [input.domains[]] One to ten domains. Required unless details is set.
 * @param {Object[]} [input.details] One to ten companies. Each object can include domain, linkedin_url, name, and website. When set, Apollo gives details precedence over domains[].
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when neither domains[] nor details is set, or either value is the wrong shape.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function bulkEnrichOrganizations(input) {
  const req = requireObject(input);
  const hasDetails = req.details !== undefined;
  const hasDomains = req["domains[]"] !== undefined;
  if (!hasDetails && !hasDomains) invalid("domains[] or details is required");
  const query = {};
  if (hasDomains) {
    const domains = checkValue("domains[]", req["domains[]"], "string[]");
    if (domains.length < 1 || domains.length > 10 || domains.some((domain) => domain.length < 1)) invalid("domains[] must contain 1 to 10 domains");
    query["domains[]"] = domains;
  }
  const body = hasDetails ? { details: requireDetails(req.details, "organizations") } : undefined;
  return apolloRequest(`/organizations/bulk_enrich${buildQuery(query)}`, "POST", body);
}
