/**
 * @description Invite a member to the current workspace.
 * @param {Object} input
 * @returns {Object}
 */
async function inviteWorkspaceMember(input) {
  const req = input && typeof input === "object" ? input : {};
  const email = asString(firstPresent(req, ["email"]));
  if (!email) return missingInput("email");
  const role = asString(firstPresent(req, ["role"]));
  if (!role) return missingInput("role");
  const body = {};
  body.email = email;
  body.role = role;
  return runAuthed("/api/v1/workspaces/invite-members", "POST", body, "MEMBER_INVITED", "MEMBER_INVITE_FAILED");
}
