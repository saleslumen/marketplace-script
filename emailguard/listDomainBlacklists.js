/**
 * @description List Domain Blacklists. GET /api/v1/blacklist-checks/domains.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listDomainBlacklists() {
  return emailguardRequest("/api/v1/blacklist-checks/domains", "GET");
}
