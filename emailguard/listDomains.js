/**
 * @description List Domains. GET /api/v1/domains.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listDomains() {
  return emailguardRequest("/api/v1/domains", "GET");
}
