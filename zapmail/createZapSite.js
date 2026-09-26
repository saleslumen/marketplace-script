/**
 * @description Create a New Zapsite. POST /v2/zap-sites.
 * @param {Object} input
 * @param {string} input.x-workspace-id
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @param {string} input.destination_url
 * @param {string} [input.name]
 * @param {string} [input.campaign_context]
 * @param {Array} [input.audience]
 * @param {string} [input.cta_label]
 * @param {string} [input.theme]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function createZapSite(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, true);
  const workspaceId = readHeader(req, "x-workspace-id", true);
  requireField(req, "destination_url", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/zap-sites", "POST", { serviceProvider, workspaceId, body });
}
