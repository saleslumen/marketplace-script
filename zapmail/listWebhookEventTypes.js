/**
 * @description Get Event Types. GET /v2/webhook/events.
 * @param {Object} input
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listWebhookEventTypes(input) {
  inputObject(input);
  return zapmailRequest("/v2/webhook/events", "GET");
}
