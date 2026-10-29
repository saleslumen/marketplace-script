/**
 * @description Create a TrulyInbox workspace.
 * @param {Object} input
 * @param {string} input.name
 * @param {number} [input.dailyWarmupBudget]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function createWorkspace(input) {
  const req = requireObjectInput(input);
  const body = { name: readRequired(req, "name", "name", "string") };
  put(body, "dailyWarmupBudget", readOptional(req, "dailyWarmupBudget", "number"));
  return trulyinboxRequest("POST", "/v2/workspaces", body);
}
