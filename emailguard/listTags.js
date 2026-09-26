/**
 * @description List tags. GET /api/v1/tags.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listTags() {
  return emailguardRequest("/api/v1/tags", "GET");
}
