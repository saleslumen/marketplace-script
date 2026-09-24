/**
 * @description Switch the current workspace by team uuid.
 * @param {Object} input
 * @returns {Object}
 */
async function switchWorkspace(input) {
  const req = input && typeof input === "object" ? input : {};
  const uuid = asString(firstPresent(req, ["uuid", "workspaceUuid", "workspace_uuid"]));
  if (!uuid) return missingInput("uuid");
  const body = {};
  body.uuid = uuid;
  return runAuthed("/api/v1/workspaces/switch-workspace", "POST", body, "WORKSPACE_SWITCHED", "WORKSPACE_SWITCH_FAILED");
}
