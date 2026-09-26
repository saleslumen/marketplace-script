/**
 * @description purchase prewarmed subscription. POST /v2/prewarmed-domains/purchase.
 * @param {Object} input
 * @param {string} input.planType
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function purchasePrewarmedSubscription(input) {
  const req = inputObject(input);
  requireField(req, "planType", "string");
  const serviceProvider = readServiceProvider(req, true);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  return zapmailRequest(withQuery("/v2/prewarmed-domains/purchase", req, ["planType"]), "POST", { serviceProvider, workspaceKey });
}
