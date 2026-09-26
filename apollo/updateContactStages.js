/**
 * @description Update contact stage for multiple contacts. POST /contacts/update_stages. https://docs.apollo.io/reference/update-contact-stage
 * @param {Object} input
 * @param {string[]} input.contact_ids[]
 * @param {string} input.contact_stage_id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when contact_ids[] or contact_stage_id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateContactStages(input) {
  const req = requireObject(input);
  requireStringList(req, "contact_ids[]");
  requireString(req, "contact_stage_id");
  const query = pickFields(req, [["contact_ids[]", "string[]"], ["contact_stage_id", "string"]]);
  return apolloRequest(`/contacts/update_stages${buildQuery(query)}`, "POST");
}
