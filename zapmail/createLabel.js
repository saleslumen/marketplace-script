/**
 * @description Create New Label. POST /v2/onebox/create-new-label.
 * @param {Object} input
 * @param {string} [input.x-workspace-id]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {string} input.account
 * @param {string} input.labelName
 * @param {string} input.color
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function createLabel(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceId = readHeader(req, "x-workspace-id", false);
  requireField(req, "account", "string");
  requireField(req, "labelName", "string");
  requireField(req, "color", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/onebox/create-new-label", "POST", { serviceProvider, workspaceId, body });
}
