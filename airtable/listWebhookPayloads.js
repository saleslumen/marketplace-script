/**
 * @description List webhook payloads. GET /v0/bases/{baseId}/webhooks/{webhookId}/payloads. limit is at most 50.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.webhookId
 * @param {number} [input.cursor] - Integer greater than or equal to 1
 * @param {number} [input.limit] - Integer from 1 to 50
 * @returns {Object} cursor, mightHaveMore, and payloads
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function listWebhookPayloads(input) {
  const located = requireWebhook(input, true);
  const parts = [];
  const cursor = optionalInt(located.req.cursor, "cursor", 1);
  if (cursor !== undefined) pushQuery(parts, "cursor", cursor);
  const limit = optionalInt(located.req.limit, "limit", 1, 50);
  if (limit !== undefined) pushQuery(parts, "limit", limit);
  const query = parts.length ? `?${parts.join("&")}` : "";
  return airtableRequest(`/bases/${encodeURIComponent(located.baseId)}/webhooks/${encodeURIComponent(located.webhookId)}/payloads${query}`, "GET");
}
