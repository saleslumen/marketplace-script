/**
 * @description List Spam Filter Tests. GET /api/v1/spam-filter-tests.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listSpamFilterTests() {
  return emailguardRequest("/api/v1/spam-filter-tests", "GET");
}
