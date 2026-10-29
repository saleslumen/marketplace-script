/**
 * @description Update workspace warmup budgets.
 * @param {Object} input
 * @param {Object[]} input.quotas
 * @param {number} input.quotas[].workspaceId
 * @param {number} input.quotas[].dailyWarmupBudget
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function updateWorkspaceQuotas(input) {
  const req = requireObjectInput(input);
  const quotas = readTypedArray(req, "quotas", true, "object");
  const body = {
    quotas: quotas.map((item) => ({
      workspaceId: readRequired(item, "workspaceId", "quotas.workspaceId", "number"),
      dailyWarmupBudget: readRequired(item, "dailyWarmupBudget", "quotas.dailyWarmupBudget", "number"),
    })),
  };
  return trulyinboxRequest("PATCH", "/v2/workspaces/quotas", body);
}
