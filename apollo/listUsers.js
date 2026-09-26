/**
 * @description Get a list of users. GET /users/search. https://docs.apollo.io/reference/get-a-list-of-users
 * @param {Object} input
 * @param {number} [input.page]
 * @param {number} [input.per_page]
 * @returns {Object} Apollo response body, including users.
 * @throws {Error} APOLLO_INVALID_INPUT when input is not an object or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listUsers(input) {
  const req = requireObject(input);
  const query = pickFields(req, [
    ["page", "integer"],
    ["per_page", "integer"],
  ]);
  return apolloRequest(`/users/search${buildQuery(query)}`, "GET");
}
