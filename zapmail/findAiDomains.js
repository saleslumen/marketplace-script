/**
 * @description AI Domain Finder. POST /v2/domains/ai-finder.
 * @param {Object} input
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @param {Array} input.keywords
 * @param {Array} input.tlds
 * @param {number} input.desiredCount
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function findAiDomains(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, true);
  requireField(req, "keywords", "array");
  requireField(req, "tlds", "array");
  requireField(req, "desiredCount", "integer");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/domains/ai-finder", "POST", { serviceProvider, body });
}
