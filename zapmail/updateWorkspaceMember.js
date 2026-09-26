/**
 * @description Update user role. PUT /v2/workspaces/members.
 * @param {Object} input
 * @param {string} input.memberId
 * @param {string} [input.x-workspace-key]
 * @param {string} input.role
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function updateWorkspaceMember(input) {
  const req = inputObject(input);
  requireField(req, "memberId", "string");
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "role", "string");
  const body = omit(req, ["memberId", "serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest(withQuery("/v2/workspaces/members", req, ["memberId"]), "PUT", { workspaceKey, body });
}
