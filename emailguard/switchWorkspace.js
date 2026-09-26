/**
 * @description Switch Workspace. POST /api/v1/workspaces/switch-workspace.
 * @param {Object} input
 * @param {string} input.uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: uuid is required when uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function switchWorkspace(input) {
  const req = inputObject(input);
  const body = {};
  body.uuid = requireText(req, "uuid");
  return emailguardRequest("/api/v1/workspaces/switch-workspace", "POST", body);
}
