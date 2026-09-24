/**
 * @description Update a workspace name.
 * @param {Object} input
 * @returns {Object}
 */
async function updateWorkspace(input) {
  const req = input && typeof input === "object" ? input : {};
  const team_id = asString(firstPresent(req, ["team_id", "teamId"]));
  if (!team_id) return missingInput("team_id");
  const name = asString(firstPresent(req, ["name"]));
  if (!name) return missingInput("name");
  let path = "/api/v1/workspaces/{team_id}";
  path = path.replace("{team_id}", encodeURIComponent(team_id));
  const body = {};
  body.name = name;
  return runAuthed(path, "PUT", body, "WORKSPACE_UPDATED", "WORKSPACE_UPDATE_FAILED");
}
