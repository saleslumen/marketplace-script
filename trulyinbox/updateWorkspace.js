/**
 * @description Update workspace settings.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {string} input.name
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function updateWorkspace(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const body = { name: readRequired(req, "name", "name", "string") };
  return trulyinboxRequest("PATCH", workspacePath(workspaceId, ""), body);
}
