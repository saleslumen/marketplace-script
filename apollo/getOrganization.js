/**
 * @description Get complete organization info. GET /organizations/{id}. https://docs.apollo.io/reference/get-complete-organization-info
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getOrganization(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  return apolloRequest(`/organizations/${encodeURIComponent(id)}`, "GET");
}
