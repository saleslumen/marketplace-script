/**
 * @description List one page of email-finder results. GET /v1/people/email-finder/{trackId}/inquiries.
 * @param {Object} input
 * @param {string} input.trackId
 * @param {number} [input.page] - Zero-based page.
 * @param {number} [input.size] - Integer from 1 to 100.
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function listEmailFinderResults(input) {
  const req = requireObjectInput(input);
  const trackId = requireText(req, "trackId");
  return aiarkRequest(`/v1/people/email-finder/${encodeURIComponent(trackId)}/inquiries${inquiriesQuery(req)}`, "GET");
}
