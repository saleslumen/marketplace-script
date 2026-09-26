/**
 * @description Purchase DNS Shield. POST /v2/dns-shield/purchase.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @param {*} [input.planType]
 * @param {*} [input.planName]
 * @param {*} [input.quantity]
 * @param {*} [input.domainNames]
 * @param {*} [input.domainIds]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function purchaseDnsShield(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, true);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/dns-shield/purchase", "POST", { serviceProvider, workspaceKey, body });
}
