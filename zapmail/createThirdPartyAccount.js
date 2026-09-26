/**
 * @description Add third party account details. POST /v2/exports/accounts/third-party.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {string} input.email
 * @param {string} input.password
 * @param {string} input.app
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function createThirdPartyAccount(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "email", "string");
  requireField(req, "password", "string");
  requireField(req, "app", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/exports/accounts/third-party", "POST", { serviceProvider, workspaceKey, body });
}
