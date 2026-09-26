/**
 * @description Fetch A Zapsite. GET /v2/zap-sites/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.x-workspace-key
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function getZapSite(input) {
  const req = inputObject(input);
  const id = requiredString(req, "id");
  const serviceProvider = readServiceProvider(req, true);
  const workspaceKey = readHeader(req, "x-workspace-key", true);
  return zapmailRequest(`/v2/zap-sites/${encodeURIComponent(id)}`, "GET", { serviceProvider, workspaceKey });
}
