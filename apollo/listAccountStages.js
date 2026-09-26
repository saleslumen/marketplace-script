/**
 * @description List account stages. GET /account_stages. https://docs.apollo.io/reference/list-account-stages
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listAccountStages() {
  return apolloRequest("/account_stages", "GET");
}
