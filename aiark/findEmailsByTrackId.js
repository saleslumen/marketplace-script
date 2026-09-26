/**
 * @description Find emails for a people-search trackId. POST /v1/people/email-finder.
 * @param {Object} input
 * @param {string} input.trackId
 * @param {string} input.webhook
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function findEmailsByTrackId(input) {
  return aiarkRequest("/v1/people/email-finder", "POST", requireTrackWebhook(input));
}
