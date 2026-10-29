/**
 * @description List workspace warmup budgets.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function listWorkspaceQuotas() {
  return trulyinboxRequest("GET", "/v2/workspaces/quotas");
}
