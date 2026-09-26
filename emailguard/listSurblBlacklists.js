/**
 * @description List SURBL Blacklists. GET /api/v1/surbl-blacklist-checks/domains.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listSurblBlacklists() {
  return emailguardRequest("/api/v1/surbl-blacklist-checks/domains", "GET");
}
