/**
 * GET /restful/v2/contacts/{contact_id}/get_hk_setting
 * @see https://www.dynadot.com/domain/api-document#get_contact_hk_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @returns {Promise<Object>}
 */
async function getContactHkSetting(input) {
  return dynadotRest({
    method: "GET",
    path: "/contacts/{contact_id}/get_hk_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
    ]
  }, input);
}
