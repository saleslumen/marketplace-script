/**
 * @description Search conversations. POST /conversations/search. https://docs.apollo.io/reference/search-conversations
 * @param {Object} input
 * @param {number} [input.page]
 * @param {number} [input.num_fetch_result]
 * @param {string} [input.conversation_type]
 * @param {string} [input.account_id]
 * @param {string[]} [input.contact_ids]
 * @param {string[]} [input.tag_ids]
 * @param {string[]} [input.tracker_ids]
 * @param {string[]} [input.organization_ids]
 * @param {Object} [input.date_range]
 * @param {string} [input.scorecard_template_id]
 * @param {number} [input.scorecard_max_rating]
 * @param {string} [input.sort_by_field]
 * @param {boolean} [input.enforce_contact_boundary]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required input is missing or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function searchConversations(input) {
  const req = requireObject(input);
  const body = pickFields(req, [["page", "integer"], ["num_fetch_result", "integer"], ["conversation_type", "string"], ["account_id", "string"], ["contact_ids", "string[]"], ["tag_ids", "string[]"], ["tracker_ids", "string[]"], ["organization_ids", "string[]"], ["date_range", "object"], ["scorecard_template_id", "string"], ["scorecard_max_rating", "number"], ["sort_by_field", "string"], ["enforce_contact_boundary", "boolean"]]);
  return apolloRequest("/conversations/search", "POST", body);
}
