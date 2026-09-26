/**
 * @description List Email Account Blacklists. GET /api/v1/blacklist-checks/email-accounts.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listEmailAccountBlacklists() {
  return emailguardRequest("/api/v1/blacklist-checks/email-accounts", "GET");
}
