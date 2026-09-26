/**
 * @description Get a list of all lists. GET /labels. https://docs.apollo.io/reference/get-a-list-of-all-lists
 * @returns {Object[]} Apollo response body.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listLabels() {
  return apolloRequest("/labels", "GET");
}
