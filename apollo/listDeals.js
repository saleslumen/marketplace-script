/**
 * @description List all deals. GET /opportunities/search. https://docs.apollo.io/reference/list-all-deals
 * @param {Object} input
 * @param {string} [input.sort_by_field]
 * @param {number} [input.page]
 * @param {number} [input.per_page]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listDeals(input) {
  const req = requireObject(input);
  const query = pickFields(req, [["sort_by_field", "string"], ["page", "integer"], ["per_page", "integer"]]);
  return apolloRequest(`/opportunities/search${buildQuery(query)}`, "GET");
}
