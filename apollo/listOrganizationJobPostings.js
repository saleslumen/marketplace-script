/**
 * @description Organization job postings. GET /organizations/{organization_id}/job_postings. https://docs.apollo.io/reference/organization-jobs-postings
 * @param {Object} input
 * @param {string} input.organization_id
 * @param {number} [input.page]
 * @param {number} [input.per_page]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when organization_id is missing or page is not an integer.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listOrganizationJobPostings(input) {
  const req = requireObject(input);
  const organizationId = requireString(req, "organization_id");
  const query = pickFields(req, [["page", "integer"], ["per_page", "integer"]]);
  return apolloRequest(`/organizations/${encodeURIComponent(organizationId)}/job_postings${buildQuery(query)}`, "GET");
}
