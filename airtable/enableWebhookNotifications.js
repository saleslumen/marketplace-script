/**
 * @description Enable or disable webhook notification pings. POST /v0/bases/{baseId}/webhooks/{webhookId}/enableNotifications.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.webhookId
 * @param {boolean} input.enable
 * @returns {Object} Airtable response body
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function enableWebhookNotifications(input) {
  const located = requireWebhook(input, true);
  if (typeof located.req.enable !== "boolean") throw new Error("AIRTABLE_INVALID_INPUT: enable must be a boolean");
  return airtableRequest(`/bases/${encodeURIComponent(located.baseId)}/webhooks/${encodeURIComponent(located.webhookId)}/enableNotifications`, "POST", { enable: located.req.enable });
}
