/**
 * @description Send invitiation to join workspace. POST /v2/workspaces/invitations.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {string} input.email
 * @param {string} input.role
 * @param {string} input.workspaceId
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function createWorkspaceInvitation(input) {
  const req = inputObject(input);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "email", "string");
  requireField(req, "role", "string");
  requireField(req, "workspaceId", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/workspaces/invitations", "POST", { workspaceKey, body });
}
