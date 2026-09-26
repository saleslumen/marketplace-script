/**
 * @description Extend a webhook expiration by 7 days. POST /v0/bases/{baseId}/webhooks/{webhookId}/refresh.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.webhookId
 * @returns {Object} expirationTime
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function refreshWebhook(input) {
  const located = requireWebhook(input, true);
  return airtableRequest(`/bases/${encodeURIComponent(located.baseId)}/webhooks/${encodeURIComponent(located.webhookId)}/refresh`, "POST");
}
