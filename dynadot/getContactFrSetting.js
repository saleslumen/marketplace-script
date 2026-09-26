/**
 * GET /restful/v2/contacts/{contact_id}/get_fr_setting
 * @see https://www.dynadot.com/domain/api-document#get_contact_fr_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @returns {Promise<Object>}
 */
async function getContactFrSetting(input) {
  return dynadotRest({
    method: "GET",
    path: "/contacts/{contact_id}/get_fr_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
    ]
  }, input);
}
