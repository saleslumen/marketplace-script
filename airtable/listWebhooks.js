/**
 * @description List webhooks on a base. GET /v0/bases/{baseId}/webhooks.
 * @param {Object} input
 * @param {string} input.baseId
 * @returns {Object} webhooks
 * @throws {Error} AIRTABLE_INVALID_INPUT when baseId is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function listWebhooks(input) {
  const located = requireWebhook(input, false);
  return airtableRequest(`/bases/${encodeURIComponent(located.baseId)}/webhooks`, "GET");
}
