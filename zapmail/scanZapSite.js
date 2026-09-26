/**
 * @description Scan A Site. GET /v2/zap-sites/scan.
 * @param {Object} input
 * @param {string} input.url
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function scanZapSite(input) {
  const req = inputObject(input);
  requireField(req, "url", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/zap-sites/scan", "GET", { body });
}
