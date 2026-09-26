/**
 * @description List deal stages. GET /opportunity_stages. https://docs.apollo.io/reference/list-deal-stages
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listDealStages() {
  return apolloRequest("/opportunity_stages", "GET");
}
