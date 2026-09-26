/**
 * @description List Contact Lists. GET /api/v1/contact-verification.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listContactLists() {
  return emailguardRequest("/api/v1/contact-verification", "GET");
}
