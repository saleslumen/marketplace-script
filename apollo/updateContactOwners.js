/**
 * @description Update contact owner for multiple contacts. POST /contacts/update_owners. https://docs.apollo.io/reference/update-contact-ownership
 * @param {Object} input
 * @param {string[]} input.contact_ids[]
 * @param {string} input.owner_id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when contact_ids[] or owner_id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateContactOwners(input) {
  const req = requireObject(input);
  requireStringList(req, "contact_ids[]");
  requireString(req, "owner_id");
  const query = pickFields(req, [["contact_ids[]", "string[]"], ["owner_id", "string"]]);
  return apolloRequest(`/contacts/update_owners${buildQuery(query)}`, "POST");
}
