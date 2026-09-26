/**
 * @description Get current user profile. GET /users/api_profile. https://docs.apollo.io/reference/get-current-user-profile
 * @param {Object} input
 * @param {boolean} [input.include_credit_usage]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when input is not an object or include_credit_usage is not a boolean.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getCurrentUser(input) {
  const req = requireObject(input);
  const query = pickFields(req, [["include_credit_usage", "boolean"]]);
  return apolloRequest(`/users/api_profile${buildQuery(query)}`, "GET");
}
