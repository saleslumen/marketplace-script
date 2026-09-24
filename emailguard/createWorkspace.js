/**
 * @description Create a workspace.
 * @param {Object} input
 * @returns {Object}
 */
async function createWorkspace(input) {
  const req = input && typeof input === "object" ? input : {};
  const name = asString(firstPresent(req, ["name"]));
  if (!name) return missingInput("name");
  const body = {};
  body.name = name;
  return runAuthed("/api/v1/workspaces", "POST", body, "WORKSPACE_CREATED", "WORKSPACE_CREATE_FAILED");
}
