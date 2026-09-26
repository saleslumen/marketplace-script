/**
 * @description List all workspace members. GET /v2/workspaces/members.
 * @param {Object} input
 * @param {string} input.limit
 * @param {string} input.page
 * @param {string} input.x-workspace-key
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listWorkspaceMembers(input) {
  const req = inputObject(input);
  requireField(req, "limit", "string");
  requireField(req, "page", "string");
  const workspaceKey = readHeader(req, "x-workspace-key", true);
  return zapmailRequest(withQuery("/v2/workspaces/members", req, ["limit", "page"]), "GET", { workspaceKey });
}
