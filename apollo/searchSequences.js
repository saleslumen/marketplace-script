/**
 * @description Search for sequences. POST /emailer_campaigns/search. https://docs.apollo.io/reference/search-for-sequences
 * @param {Object} input
 * @param {string} [input.q_name]
 * @param {string} [input.page]
 * @param {string} [input.per_page]
 * @returns {Object} Apollo response body, including emailer_campaigns.
 * @throws {Error} APOLLO_INVALID_INPUT when input is not an object or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function searchSequences(input) {
  const req = requireObject(input);
  const query = pickFields(req, [
    ["q_name", "string"],
    ["page", "string"],
    ["per_page", "string"],
  ]);
  return apolloRequest(`/emailer_campaigns/search${buildQuery(query)}`, "POST");
}
