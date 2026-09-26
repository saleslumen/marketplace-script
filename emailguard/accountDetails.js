/**
 * @description Account Details. GET /api/v1/user.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function accountDetails() {
  return emailguardRequest("/api/v1/user", "GET");
}
