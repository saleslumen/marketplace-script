/**
 * @description Get contact sequence activity. POST /emailer_campaigns/activity_feed. https://docs.apollo.io/reference/get-contact-sequence-activity
 * @param {Object} input
 * @param {string} input.contact_id
 * @param {string} [input.sequence_id]
 * @param {number} [input.per_page]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when contact_id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getSequenceActivity(input) {
  const req = requireObject(input);
  const body = { contact_id: requireString(req, "contact_id") };
  Object.assign(body, pickFields(req, [["sequence_id", "string"], ["per_page", "integer"]]));
  return apolloRequest("/emailer_campaigns/activity_feed", "POST", body);
}
