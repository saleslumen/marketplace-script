/**
 * @description Purchase subscription. POST /v2/subscriptions/purchase.
 * @param {Object} input
 * @param {string} input.planName
 * @param {string} [input.billingCycle]
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function purchaseSubscription(input) {
  const req = inputObject(input);
  requireField(req, "planName", "string");
  const serviceProvider = readServiceProvider(req, true);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  return zapmailRequest(withQuery("/v2/subscriptions/purchase", req, ["planName", "billingCycle"]), "POST", { serviceProvider, workspaceKey });
}
