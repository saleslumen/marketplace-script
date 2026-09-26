/**
 * @description Find a mobile phone. POST /v2/people/mobile-phone-finder. A miss is HTTP 200 with data null.
 * @param {Object} input
 * @param {string} [input.linkedin] - Profile URL. Alternative to domain and name.
 * @param {string} [input.domain] - Required together with name.
 * @param {string} [input.name] - Required together with domain.
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function findMobilePhoneV2(input) {
  return aiarkRequest("/v2/people/mobile-phone-finder", "POST", requireMobilePhone(input));
}
