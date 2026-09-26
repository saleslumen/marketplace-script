/**
 * @description Export one person with email. POST /v2/people/export/single. A miss is HTTP 200 with data null.
 * @param {Object} input
 * @param {string} [input.id] - Person id. id or url is required.
 * @param {string} [input.url] - Profile URL. id or url is required.
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function exportSinglePersonV2(input) {
  return aiarkRequest("/v2/people/export/single", "POST", requireIdOrUrl(input));
}
