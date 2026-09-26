/**
 * @description Invite Team Member. POST /api/v1/workspaces/invite-members.
 * @param {Object} input
 * @param {string} input.email
 * @param {string} input.role
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: email is required when email is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: role is required when role is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function inviteTeamMember(input) {
  const req = inputObject(input);
  const body = {};
  body.email = requireText(req, "email");
  body.role = requireText(req, "role");
  return emailguardRequest("/api/v1/workspaces/invite-members", "POST", body);
}
