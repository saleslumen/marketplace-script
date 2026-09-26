/**
 * @description Look up a person from an email address. POST /v1/people/reverse-lookup.
 * @param {Object} input
 * @param {string} input.search - Email address.
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function reversePeopleLookup(input) {
  return aiarkRequest("/v1/people/reverse-lookup", "POST", requireReverseLookup(input));
}
