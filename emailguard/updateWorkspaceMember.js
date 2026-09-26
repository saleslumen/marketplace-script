/**
 * @description Update Workspace Member. PUT /api/v1/workspaces/members/{user_id}.
 * @param {Object} input
 * @param {string} input.user_id
 * @param {string} input.role
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: user_id is required when user_id is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: role is required when role is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function updateWorkspaceMember(input) {
  const req = inputObject(input);
  const user_id = requireText(req, "user_id");
  const body = {};
  body.role = requireText(req, "role");
  return emailguardRequest(`/api/v1/workspaces/members/${encodeURIComponent(user_id)}`, "PUT", body);
}
