/**
 * @description Logout. POST /api/v1/user/logout.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function logout() {
  return emailguardRequest("/api/v1/user/logout", "POST");
}
