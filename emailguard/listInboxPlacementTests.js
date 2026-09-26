/**
 * @description List Inbox Placement Tests. GET /api/v1/inbox-placement-tests.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listInboxPlacementTests() {
  return emailguardRequest("/api/v1/inbox-placement-tests", "GET");
}
