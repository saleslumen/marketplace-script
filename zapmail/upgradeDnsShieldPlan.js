/**
 * @description Upgrade DNS Shield LTD Plan. POST /v2/dns-shield/upgrade-plan.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {string} input.subscriptionId
 * @param {string} input.newPlanName
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function upgradeDnsShieldPlan(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "subscriptionId", "string");
  requireField(req, "newPlanName", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/dns-shield/upgrade-plan", "POST", { serviceProvider, workspaceKey, body });
}
