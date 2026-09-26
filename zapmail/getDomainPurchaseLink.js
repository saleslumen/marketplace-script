/**
 * @description Get domains purchase payment link. POST /v2/domains/buy.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {Array} input.domains
 * @param {boolean} input.useWallet
 * @param {boolean} input.enableDnsShield
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function getDomainPurchaseLink(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "domains", "array");
  requireField(req, "useWallet", "boolean");
  requireField(req, "enableDnsShield", "boolean");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/domains/buy", "POST", { serviceProvider, workspaceKey, body });
}
