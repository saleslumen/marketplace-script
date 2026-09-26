/**
 * @description Delete Workspace Member. DELETE /api/v1/workspaces/members/{user_id}.
 * @param {Object} input
 * @param {string} input.user_id
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: user_id is required when user_id is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function deleteWorkspaceMember(input) {
  const req = inputObject(input);
  const user_id = requireText(req, "user_id");
  return emailguardRequest(`/api/v1/workspaces/members/${encodeURIComponent(user_id)}`, "DELETE");
}
