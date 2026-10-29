/**
 * @description Get provider workspace sync status.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} input.providerWorkspaceId
 * @param {string} input.jobId
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getProviderWorkspaceSyncStatus(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const providerWorkspaceId = readRequired(req, "providerWorkspaceId", "providerWorkspaceId", "number");
  const query = trulyinboxQuery({ jobId: readRequired(req, "jobId", "jobId", "string") });
  return trulyinboxRequest("GET", `${workspacePath(workspaceId, `/provider-workspaces/${encodeURIComponent(providerWorkspaceId)}/sync-status`)}${query}`);
}
