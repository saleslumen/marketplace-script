/**
 * GET /restful/v2/contacts/{contact_id}/get_ca_setting
 * @see https://www.dynadot.com/domain/api-document#get_contact_ca_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @returns {Promise<Object>}
 */
async function getContactCaSetting(input) {
  return dynadotRest({
    method: "GET",
    path: "/contacts/{contact_id}/get_ca_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
    ]
  }, input);
}
