/**
 * @description Pause warmup for many email accounts.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number[]} input.ids
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function bulkPauseWarmup(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const body = { ids: readTypedArray(req, "ids", true, "number") };
  return trulyinboxRequest("POST", workspacePath(workspaceId, "/accounts/bulk/warmup/pause"), body);
}
