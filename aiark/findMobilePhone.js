/**
 * @description Find a mobile phone. POST /v1/people/mobile-phone-finder.
 * @param {Object} input
 * @param {string} [input.linkedin] - Profile URL. Alternative to domain and name.
 * @param {string} [input.domain] - Required together with name.
 * @param {string} [input.name] - Required together with domain.
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function findMobilePhone(input) {
  return aiarkRequest("/v1/people/mobile-phone-finder", "POST", requireMobilePhone(input));
}
