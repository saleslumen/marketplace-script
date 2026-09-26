/**
 * @description Read email-finder statistics. GET /v1/people/email-finder/{trackId}/statistics.
 * @param {Object} input
 * @param {string} input.trackId
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function getEmailFinderStatistics(input) {
  const req = requireObjectInput(input);
  const trackId = requireText(req, "trackId");
  return aiarkRequest(`/v1/people/email-finder/${encodeURIComponent(trackId)}/statistics`, "GET");
}
