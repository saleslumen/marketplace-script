/**
 * @description List all invitations. GET /v2/workspaces/invitations.
 * @param {Object} input
 * @param {string} input.limit
 * @param {string} input.page
 * @param {string} input.status
 * @param {string} [input.x-workspace-key]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listWorkspaceInvitations(input) {
  const req = inputObject(input);
  requireField(req, "limit", "string");
  requireField(req, "page", "string");
  requireField(req, "status", "string");
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  return zapmailRequest(withQuery("/v2/workspaces/invitations", req, ["limit", "page", "status"]), "GET", { workspaceKey });
}
