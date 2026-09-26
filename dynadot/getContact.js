/**
 * GET /restful/v2/contacts/{contact_id}
 * @see https://www.dynadot.com/domain/api-document#get_contact
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @returns {Promise<Object>}
 */
async function getContact(input) {
  return dynadotRest({
    method: "GET",
    path: "/contacts/{contact_id}",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
    ]
  }, input);
}
