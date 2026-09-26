/**
 * @description User Workspaces. GET /api/v1/workspaces.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function userWorkspaces() {
  return emailguardRequest("/api/v1/workspaces", "GET");
}
