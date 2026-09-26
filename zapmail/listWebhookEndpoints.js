/**
 * @description Get Webhook Endpoints/Destinations. GET /v2/webhooks/endpoints.
 * @param {Object} input
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listWebhookEndpoints(input) {
  inputObject(input);
  return zapmailRequest("/v2/webhooks/endpoints", "GET");
}
