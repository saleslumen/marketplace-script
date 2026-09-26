/**
 * @description Organization enrichment. GET /organizations/enrich. https://docs.apollo.io/reference/organization-enrichment
 * @param {Object} input
 * @param {string} [input.domain] Company domain. One of domain, linkedin_url, or website is required.
 * @param {string} [input.linkedin_url]
 * @param {string} [input.name] Improves match accuracy. Name alone is not an identifier.
 * @param {string} [input.website]
 * @returns {Object} Apollo response body, including organization.
 * @throws {Error} APOLLO_INVALID_INPUT when domain, linkedin_url, and website are all absent, or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function enrichOrganization(input) {
  const req = requireObject(input);
  requireOrganizationIdentifier(req);
  const query = pickFields(req, [
    ["domain", "string"],
    ["linkedin_url", "string"],
    ["name", "string"],
    ["website", "string"],
  ]);
  return apolloRequest(`/organizations/enrich${buildQuery(query)}`, "GET");
}
