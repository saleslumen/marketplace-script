/**
 * @description Resend an email-finder completion webhook. PATCH /v1/people/email-finder/{trackId}/notify.
 * @param {Object} input
 * @param {string} input.trackId
 * @param {string} input.webhook
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when a required input is missing or invalid
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function resendEmailFinderWebhook(input) {
  const req = requireObjectInput(input);
  const trackId = requireText(req, "trackId");
  requireText(req, "webhook");
  return aiarkRequest(`/v1/people/email-finder/${encodeURIComponent(trackId)}/notify`, "PATCH", { webhook: req.webhook });
}
