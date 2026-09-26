/**
 * @description Analyze a profile. POST /v1/people/analysis.
 * @param {Object} input
 * @param {string} input.url - Profile URL.
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function analyzePersonality(input) {
  return aiarkRequest("/v1/people/analysis", "POST", requireProfileUrl(input));
}
