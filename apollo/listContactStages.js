/**
 * @description List contact stages. GET /contact_stages. https://docs.apollo.io/reference/list-contact-stages
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listContactStages() {
  return apolloRequest("/contact_stages", "GET");
}
