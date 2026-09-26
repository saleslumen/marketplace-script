/**
 * GET /restful/v2/contacts/{contact_id}/get_eu_setting
 * @see https://www.dynadot.com/domain/api-document#get_contact_eu_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @returns {Promise<Object>}
 */
async function getContactEuSetting(input) {
  return dynadotRest({
    method: "GET",
    path: "/contacts/{contact_id}/get_eu_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
    ]
  }, input);
}
