/**
 * @description Invite a workspace member.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {string} input.email
 * @param {string} input.role
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function inviteMember(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const body = {
    email: readRequired(req, "email", "email", "string"),
    role: readRequired(req, "role", "role", "string"),
  };
  return trulyinboxRequest("POST", workspacePath(workspaceId, "/members/invite"), body);
}
