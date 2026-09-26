/**
 * PUT /restful/v2/contacts/{contact_id}/set_lv_setting
 * @see https://www.dynadot.com/domain/api-document#set_contact_lv_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact_extension
 * @param {string} input.contact_extension.registration_number
 * @param {string} input.contact_extension.vat_number
 * @param {string} input.contact_extension.tld
 * @returns {Promise<Object>}
 */
async function setContactLvSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}/set_lv_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_extension", in: "body", required: true, type: "object", fields: [
        { name: "registration_number", required: true, type: "string" },
        { name: "vat_number", required: true, type: "string" },
        { name: "tld", required: true, type: "string" },
      ] },
    ]
  }, input);
}
