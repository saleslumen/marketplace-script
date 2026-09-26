/**
 * @description Create New Webhook Endpoint/Destination. POST /v2/webhooks/endpoints.
 * @param {Object} input
 * @param {string} input.url
 * @param {Array} input.enabled_events
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function createWebhookEndpoint(input) {
  const req = inputObject(input);
  requireField(req, "url", "string");
  requireField(req, "enabled_events", "array");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/webhooks/endpoints", "POST", { body });
}
