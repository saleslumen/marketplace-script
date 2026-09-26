/**
 * @description Get domain connection requests. GET /v2/domains/connection-requests.
 * @param {Object} input
 * @param {string} [input.page]
 * @param {string} [input.limit]
 * @param {string} [input.status]
 * @param {string} [input.contains]
 * @param {string} [input.cloudflareCredentialsId]
 * @param {string} input.x-workspace-key
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listDomainConnectionRequests(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", true);
  return zapmailRequest(withQuery("/v2/domains/connection-requests", req, ["page", "limit", "status", "contains", "cloudflareCredentialsId"]), "GET", { serviceProvider, workspaceKey });
}
