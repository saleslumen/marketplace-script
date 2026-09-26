/**
 * @description Purchase add on mailboxes. POST /v2/wallet/buy-addon-mailboxes.
 * @param {Object} input
 * @param {string} input.quantity
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function purchaseAddonMailboxes(input) {
  const req = inputObject(input);
  requireField(req, "quantity", "string");
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  return zapmailRequest(withQuery("/v2/wallet/buy-addon-mailboxes", req, ["quantity"]), "POST", { serviceProvider, workspaceKey });
}
