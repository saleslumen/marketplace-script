/**
 * @description Accept Workspace Invitation. GET /api/v1/workspaces/accept/{team_invitation_uuid}.
 * @param {Object} input
 * @param {string} input.team_invitation_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: team_invitation_uuid is required when team_invitation_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function acceptWorkspaceInvitation(input) {
  const req = inputObject(input);
  const team_invitation_uuid = requireText(req, "team_invitation_uuid");
  return emailguardRequest(`/api/v1/workspaces/accept/${encodeURIComponent(team_invitation_uuid)}`, "GET");
}
