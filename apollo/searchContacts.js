/**
 * @description Search for contacts. POST /contacts/search. https://docs.apollo.io/reference/search-for-contacts
 * @param {Object} input
 * @param {string} [input.q_keywords]
 * @param {string[]} [input.contact_stage_ids]
 * @param {string[]} [input.contact_label_ids]
 * @param {string} [input.sort_by_field] contact_last_activity_date, contact_email_last_opened_at, contact_email_last_clicked_at, contact_created_at, or contact_updated_at.
 * @param {boolean} [input.sort_ascending]
 * @param {number} [input.per_page]
 * @param {number} [input.page]
 * @returns {Object} Apollo response body, including contacts.
 * @throws {Error} APOLLO_INVALID_INPUT when input is not an object or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function searchContacts(input) {
  const req = requireObject(input);
  const body = pickFields(req, [
    ["q_keywords", "string"],
    ["contact_stage_ids", "string[]"],
    ["contact_label_ids", "string[]"],
    ["sort_by_field", "string"],
    ["sort_ascending", "boolean"],
    ["per_page", "integer"],
    ["page", "integer"],
  ]);
  return apolloRequest("/contacts/search", "POST", body);
}
