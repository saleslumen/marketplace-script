/**
 * @description Delete a webhook. DELETE /v0/bases/{baseId}/webhooks/{webhookId}.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.webhookId
 * @returns {Object} Airtable response body
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function deleteWebhook(input) {
  const located = requireWebhook(input, true);
  return airtableRequest(`/bases/${encodeURIComponent(located.baseId)}/webhooks/${encodeURIComponent(located.webhookId)}`, "DELETE");
}
