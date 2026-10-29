/**
 * @description Delete one email account.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} input.id
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function deleteEmailAccount(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const id = readRequired(req, "id", "id", "number");
  return trulyinboxRequest("DELETE", workspacePath(workspaceId, `/accounts/${encodeURIComponent(id)}`));
}
