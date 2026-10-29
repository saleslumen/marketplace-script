/**
 * @description List TrulyInbox workspaces visible to this key.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function listWorkspaces() {
  return trulyinboxRequest("GET", "/v2/workspaces");
}
