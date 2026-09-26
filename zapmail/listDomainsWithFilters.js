/**
 * @description Retrieve All Domains (With filters). POST /v2/domains.
 * @param {Object} input
 * @param {string} [input.status]
 * @param {string} [input.contains]
 * @param {Array} [input.tagIds]
 * @param {string} [input.sortBy]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listDomainsWithFilters(input) {
  const req = inputObject(input);
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/domains", "POST", { body });
}
