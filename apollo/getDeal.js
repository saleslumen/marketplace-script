/**
 * @description View deal. GET /opportunities/{opportunity_id}. https://docs.apollo.io/reference/view-deal
 * @param {Object} input
 * @param {string} input.opportunity_id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when opportunity_id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getDeal(input) {
  const req = requireObject(input);
  const opportunityId = requireString(req, "opportunity_id");
  return apolloRequest(`/opportunities/${encodeURIComponent(opportunityId)}`, "GET");
}
