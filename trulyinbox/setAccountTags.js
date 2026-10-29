/**
 * @description Replace the tags on one email account.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} input.id
 * @param {string[]} input.tags
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function setAccountTags(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const id = readRequired(req, "id", "id", "number");
  const body = { tags: readTypedArray(req, "tags", true, "string") };
  return trulyinboxRequest("PUT", workspacePath(workspaceId, `/accounts/${encodeURIComponent(id)}/tags`), body);
}
