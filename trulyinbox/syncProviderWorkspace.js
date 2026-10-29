/**
 * @description Confirm a provider workspace sync.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} input.providerWorkspaceId
 * @param {boolean} input.selectAll
 * @param {string[]} [input.selectedDomains]
 * @param {string[]} [input.deselect]
 * @param {string[]} [input.emailsToConnect]
 * @param {boolean} input.enableWarmup
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function syncProviderWorkspace(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const providerWorkspaceId = readRequired(req, "providerWorkspaceId", "providerWorkspaceId", "number");
  const body = {
    selectAll: readRequired(req, "selectAll", "selectAll", "boolean"),
    enableWarmup: readRequired(req, "enableWarmup", "enableWarmup", "boolean"),
  };
  put(body, "selectedDomains", readTypedArray(req, "selectedDomains", false, "string"));
  put(body, "deselect", readTypedArray(req, "deselect", false, "string"));
  put(body, "emailsToConnect", readTypedArray(req, "emailsToConnect", false, "string"));
  return trulyinboxRequest("POST", workspacePath(workspaceId, `/provider-workspaces/${encodeURIComponent(providerWorkspaceId)}/sync`), body);
}
