/**
 * @description List Email Accounts. GET /api/v1/email-accounts.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listEmailAccounts() {
  return emailguardRequest("/api/v1/email-accounts", "GET");
}
