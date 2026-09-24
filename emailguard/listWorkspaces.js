/**
 * @description List workspaces for the authenticated user.
 * @returns {Object}
 */
async function listWorkspaces() {
  return runAuthed("/api/v1/workspaces", "GET", undefined, "WORKSPACES", "WORKSPACES_FAILED");
}
