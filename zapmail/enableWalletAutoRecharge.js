/**
 * @description Enable auto recharge. POST /v2/wallet/enable-auto-recharge.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {boolean} input.enable
 * @param {number} input.threshold
 * @param {number} input.minimumRechargeAmount
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function enableWalletAutoRecharge(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "enable", "boolean");
  requireField(req, "threshold", "integer");
  requireField(req, "minimumRechargeAmount", "integer");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/wallet/enable-auto-recharge", "POST", { serviceProvider, workspaceKey, body });
}
