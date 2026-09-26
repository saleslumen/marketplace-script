/**
 * @description List Domains Eligible for Renewal. POST /v2/domains/renewal-soon.
 * @param {Object} input
 * @param {number} [input.page]
 * @param {number} [input.limit]
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {string} [input.contains]
 * @param {Array} [input.tagIds]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listRenewableDomains(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  const body = omit(req, ["page", "limit", "serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest(withQuery("/v2/domains/renewal-soon", req, ["page", "limit"]), "POST", { serviceProvider, workspaceKey, body });
}
