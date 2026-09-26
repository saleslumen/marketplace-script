/**
 * @description Get prewarmed domains. GET /v2/prewarmed-domains/get-domains.
 * @param {Object} input
 * @param {number} input.page
 * @param {number} input.limit
 * @param {string} [input.contains]
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listPrewarmedDomains(input) {
  const req = inputObject(input);
  requireField(req, "page", "integer");
  requireField(req, "limit", "integer");
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  return zapmailRequest(withQuery("/v2/prewarmed-domains/get-domains", req, ["page", "limit", "contains"]), "GET", { serviceProvider, workspaceKey });
}
