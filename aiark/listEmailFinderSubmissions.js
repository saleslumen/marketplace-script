/**
 * @description List email-finder submissions. GET /v1/people/email-finder/submissions.
 * @param {Object} input
 * @param {"PENDING"|"SETTLED"} [input.state]
 * @param {boolean} [input.fullyRefunded]
 * @param {number} [input.page] - Zero-based page.
 * @param {number} [input.size] - Integer from 1 to 100.
 * @param {string[]} [input.sort] - property,(asc|desc), repeated.
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function listEmailFinderSubmissions(input) {
  return aiarkRequest(`/v1/people/email-finder/submissions${submissionsQuery(input)}`, "GET");
}
