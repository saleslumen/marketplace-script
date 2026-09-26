/**
 * @description Search people. POST /v1/people.
 * @param {Object} input
 * @param {Object} [input.account]
 * @param {Object} [input.contact]
 * @param {Object} [input.lists]
 * @param {number} input.page - Zero-based page.
 * @param {number} input.size - Integer from 0 to 100.
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function searchPeople(input) {
  return aiarkRequest("/v1/people", "POST", requireSearchBody(input, 0, 100));
}
