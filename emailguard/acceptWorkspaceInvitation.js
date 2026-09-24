/**
 * @description Accept a workspace invitation by invitation uuid.
 * @param {Object} input
 * @returns {Object}
 */
async function acceptWorkspaceInvitation(input) {
  const req = input && typeof input === "object" ? input : {};
  const team_invitation_uuid = asString(firstPresent(req, ["team_invitation_uuid", "teamInvitationUuid"]));
  if (!team_invitation_uuid) return missingInput("team_invitation_uuid");
  let path = "/api/v1/workspaces/accept/{team_invitation_uuid}";
  path = path.replace("{team_invitation_uuid}", encodeURIComponent(team_invitation_uuid));
  return runAuthed(path, "GET", undefined, "INVITATION_ACCEPTED", "INVITATION_ACCEPT_FAILED");
}
