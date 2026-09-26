/**
 * @description Get complete person info. GET /people/{id}. https://docs.apollo.io/reference/get-complete-person-info
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getPerson(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  return apolloRequest(`/people/${encodeURIComponent(id)}`, "GET");
}
