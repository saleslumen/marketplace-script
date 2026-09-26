/**
 * @description List all third-party accounts. GET /v2/exports/accounts/third-party.
 * @param {Object} input
 * @param {string} input.app
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listThirdPartyAccounts(input) {
  const req = inputObject(input);
  requireField(req, "app", "string");
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  return zapmailRequest(withQuery("/v2/exports/accounts/third-party", req, ["app"]), "GET", { serviceProvider, workspaceKey });
}
