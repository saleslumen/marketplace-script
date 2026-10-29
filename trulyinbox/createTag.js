/**
 * @description Create a workspace tag.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {string} input.name
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function createTag(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const body = { name: readRequired(req, "name", "name", "string") };
  return trulyinboxRequest("POST", workspacePath(workspaceId, "/tags"), body);
}
