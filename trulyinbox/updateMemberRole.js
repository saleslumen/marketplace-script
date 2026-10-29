/**
 * @description Update a member role.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} input.userId
 * @param {string} input.role
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function updateMemberRole(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const userId = readRequired(req, "userId", "userId", "number");
  const body = { role: readRequired(req, "role", "role", "string") };
  return trulyinboxRequest("PATCH", workspacePath(workspaceId, `/members/${encodeURIComponent(userId)}`), body);
}
