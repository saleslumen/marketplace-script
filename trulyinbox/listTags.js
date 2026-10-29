/**
 * @description List workspace tags.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function listTags(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  return trulyinboxRequest("GET", workspacePath(workspaceId, "/tags"));
}
