/**
 * @description Get the authenticated user's current workspace.
 * @returns {Object}
 */
async function getCurrentWorkspace() {
  return runAuthed("/api/v1/workspaces/current", "GET", undefined, "CURRENT_WORKSPACE", "CURRENT_WORKSPACE_FAILED");
}
