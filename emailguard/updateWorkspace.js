/**
 * @description Update Workspace. PUT /api/v1/workspaces/{team_id}.
 * @param {Object} input
 * @param {string} input.team_id
 * @param {string} input.name
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: team_id is required when team_id is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: name is required when name is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function updateWorkspace(input) {
  const req = inputObject(input);
  const team_id = requireText(req, "team_id");
  const body = {};
  body.name = requireText(req, "name");
  return emailguardRequest(`/api/v1/workspaces/${encodeURIComponent(team_id)}`, "PUT", body);
}
