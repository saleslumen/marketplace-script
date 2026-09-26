/**
 * @description Create a webhook. POST /v0/bases/{baseId}/webhooks. A base can have 10 webhooks.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {Object} input.specification
 * @param {string} [input.notificationUrl]
 * @returns {Object} id, macSecretBase64, and expirationTime
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function createWebhook(input) {
  const located = requireWebhook(input, false);
  if (!located.req.specification || typeof located.req.specification !== "object" || Array.isArray(located.req.specification)) {
    throw new Error("AIRTABLE_INVALID_INPUT: specification must be an object");
  }
  const body = {};
  if (located.req.notificationUrl !== undefined && located.req.notificationUrl !== null && located.req.notificationUrl !== "") {
    body.notificationUrl = requireId(located.req.notificationUrl, "notificationUrl");
  }
  body.specification = located.req.specification;
  return airtableRequest(`/bases/${encodeURIComponent(located.baseId)}/webhooks`, "POST", body);
}
