/**
 * @description View a contact. GET /contacts/{contact_id}. https://docs.apollo.io/reference/view-a-contact
 * @param {Object} input
 * @param {string} input.contact_id
 * @returns {Object} Apollo response body, including contact.
 * @throws {Error} APOLLO_INVALID_INPUT when contact_id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getContact(input) {
  const req = requireObject(input);
  const contactId = requireString(req, "contact_id");
  return apolloRequest(`/contacts/${encodeURIComponent(contactId)}`, "GET");
}
