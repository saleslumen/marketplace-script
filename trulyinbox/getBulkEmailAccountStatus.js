/**
 * @description Bulk email account status.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number[]} input.accountIds
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getBulkEmailAccountStatus(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const body = { accountIds: readTypedArray(req, "accountIds", true, "number") };
  return trulyinboxRequest("POST", workspacePath(workspaceId, "/accounts/bulk-status"), body);
}
