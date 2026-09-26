/**
 * @description list domain tags. GET /v2/domains/tags.
 * @param {Object} input
 * @param {string} [input.x-workspace-id]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listDomainTags(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceId = readHeader(req, "x-workspace-id", false);
  return zapmailRequest("/v2/domains/tags", "GET", { serviceProvider, workspaceId });
}
