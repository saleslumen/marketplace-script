/**
 * @description Update a Specific Endpoint. PATCH /v2/webhooks/endpoints/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.url
 * @param {Array} input.enabled_events
 * @param {string} input.status
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function updateWebhookEndpoint(input) {
  const req = inputObject(input);
  const id = requiredString(req, "id");
  requireField(req, "url", "string");
  requireField(req, "enabled_events", "array");
  requireField(req, "status", "string");
  const body = omit(req, ["id", "serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest(`/v2/webhooks/endpoints/${encodeURIComponent(id)}`, "PATCH", { body });
}
