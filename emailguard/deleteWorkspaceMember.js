/**
 * @description Remove a workspace member.
 * @param {Object} input
 * @returns {Object}
 */
async function deleteWorkspaceMember(input) {
  const req = input && typeof input === "object" ? input : {};
  const user_id = asString(firstPresent(req, ["user_id", "userId"]));
  if (!user_id) return missingInput("user_id");
  let path = "/api/v1/workspaces/members/{user_id}";
  path = path.replace("{user_id}", encodeURIComponent(user_id));
  return runAuthed(path, "DELETE", undefined, "MEMBER_DELETED", "MEMBER_DELETE_FAILED");
}
