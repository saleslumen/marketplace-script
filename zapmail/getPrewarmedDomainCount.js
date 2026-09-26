/**
 * @description Get Available Domains Count. GET /v2/prewarmed-domains/count.
 * @param {Object} input
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function getPrewarmedDomainCount(input) {
  inputObject(input);
  return zapmailRequest("/v2/prewarmed-domains/count", "GET");
}
