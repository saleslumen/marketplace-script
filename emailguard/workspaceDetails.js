/**
 * @description Workspace Details. GET /api/v1/workspaces/current.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function workspaceDetails() {
  return emailguardRequest("/api/v1/workspaces/current", "GET");
}
