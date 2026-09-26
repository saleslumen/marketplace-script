/**
 * @description Get a list of notes. GET /notes. https://docs.apollo.io/reference/get-a-list-of-notes
 * @param {Object} input
 * @param {string} [input.contact_id]
 * @param {string} [input.account_id]
 * @param {string} [input.opportunity_id]
 * @param {string} [input.calendar_event_id]
 * @param {string} [input.conversation_id]
 * @param {string[]} [input.conversation_ids]
 * @param {string[]} [input.contact_ids]
 * @param {string} [input.start_date]
 * @param {string} [input.sort_by_field]
 * @param {string} [input.sort_direction]
 * @param {number} [input.skip]
 * @param {number} [input.limit] At most 100.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when skip or limit is outside its documented range.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listNotes(input) {
  const req = requireObject(input);
  const query = pickFields(req, [["contact_id", "string"], ["account_id", "string"], ["opportunity_id", "string"], ["calendar_event_id", "string"], ["conversation_id", "string"], ["conversation_ids", "string[]"], ["contact_ids", "string[]"], ["start_date", "string"], ["sort_by_field", "string"], ["sort_direction", "string"], ["skip", "integer"], ["limit", "integer"]]);
  if (query.skip !== undefined && query.skip < 0) invalid("skip must be an integer greater than or equal to 0");
  if (query.limit !== undefined && (query.limit < 1 || query.limit > 100)) invalid("limit must be an integer from 1 to 100");
  return apolloRequest(`/notes${buildQuery(query)}`, "GET");
}
