/**
 * @description View an account. GET /accounts/{id}. https://docs.apollo.io/reference/view-an-account
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getAccount(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  return apolloRequest(`/accounts/${encodeURIComponent(id)}`, "GET");
}
