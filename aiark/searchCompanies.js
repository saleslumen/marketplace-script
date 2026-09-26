/**
 * @description Search companies. POST /v1/companies.
 * @param {Object} input
 * @param {string[]} [input.lookalikeDomains] - At most 5 domains or company URLs.
 * @param {Object} [input.account]
 * @param {Object} [input.lists]
 * @param {number} input.page - Zero-based page.
 * @param {number} input.size - Integer from 0 to 100.
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function searchCompanies(input) {
  return aiarkRequest("/v1/companies", "POST", requireCompanyBody(input));
}
