/**
 * @description View associated deals. POST /contacts/{contact_id}/opportunities. https://docs.apollo.io/reference/view-associated-deals
 * @param {Object} input
 * @param {string} input.contact_id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when contact_id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listContactDeals(input) {
  const req = requireObject(input);
  const contactId = requireString(req, "contact_id");
  return apolloRequest(`/contacts/${encodeURIComponent(contactId)}/opportunities`, "POST");
}
