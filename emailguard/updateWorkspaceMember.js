/**
 * @description Update a workspace member role.
 * @param {Object} input
 * @returns {Object}
 */
async function updateWorkspaceMember(input) {
  const req = input && typeof input === "object" ? input : {};
  const user_id = asString(firstPresent(req, ["user_id", "userId"]));
  if (!user_id) return missingInput("user_id");
  const role = asString(firstPresent(req, ["role"]));
  if (!role) return missingInput("role");
  let path = "/api/v1/workspaces/members/{user_id}";
  path = path.replace("{user_id}", encodeURIComponent(user_id));
  const body = {};
  body.role = role;
  return runAuthed(path, "PUT", body, "MEMBER_UPDATED", "MEMBER_UPDATE_FAILED");
}
