/**
 * @description Get Prewarm Subscriptions. GET /v2/prewarmed-domains/subscriptions.
 * @param {Object} input
 * @param {string} [input.status]
 * @param {string} [input.page]
 * @param {string} [input.limit]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listPrewarmedSubscriptions(input) {
  const req = inputObject(input);
  return zapmailRequest(withQuery("/v2/prewarmed-domains/subscriptions", req, ["status", "page", "limit"]), "GET");
}
