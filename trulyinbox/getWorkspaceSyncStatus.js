/**
 * @description Read one bulk-connect sync job.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.jobId
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getWorkspaceSyncStatus(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "string");
  const query = trulyinboxQuery({ jobId: readRequired(req, "jobId", "jobId", "string") });
  return trulyinboxRequest("GET", `/workspaces/${encodeURIComponent(workspaceId)}/sync-status${query}`);
}
