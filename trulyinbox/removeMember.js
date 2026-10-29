/**
 * @description Remove a workspace member.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} input.userId
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function removeMember(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const userId = readRequired(req, "userId", "userId", "number");
  return trulyinboxRequest("DELETE", workspacePath(workspaceId, `/members/${encodeURIComponent(userId)}`));
}
