/**
 * @description Export people with email. POST /v1/people/export.
 * @param {Object} input
 * @param {Object} [input.account]
 * @param {Object} [input.contact]
 * @param {Object} [input.lists]
 * @param {number} input.page - Zero-based page.
 * @param {number} input.size - Total export size, an integer from 1 to 10000.
 * @param {string} input.webhook - HTTPS URL notified when the job completes.
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function exportPeople(input) {
  return aiarkRequest("/v1/people/export", "POST", requireExportBody(input));
}
