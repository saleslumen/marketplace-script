/**
 * @description Get a list of email accounts. GET /email_accounts. https://docs.apollo.io/reference/get-a-list-of-email-accounts
 * @returns {Object} Apollo response body, including email_accounts.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listEmailAccounts() {
  return apolloRequest("/email_accounts", "GET");
}
