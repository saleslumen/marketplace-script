/**
 * PUT /restful/v2/contacts/{contact_id}/set_ro_setting
 * @see https://www.dynadot.com/domain/api-document#set_contact_ro_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact_extension
 * @param {string} input.contact_extension.registrant_type
 * @param {string} input.contact_extension.fiscal_code
 * @param {string} input.contact_extension.registration_code
 * @param {string} input.contact_extension.tld
 * @returns {Promise<Object>}
 */
async function setContactRoSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}/set_ro_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_extension", in: "body", required: true, type: "object", fields: [
        { name: "registrant_type", required: true, type: "string" },
        { name: "fiscal_code", required: true, type: "string" },
        { name: "registration_code", required: true, type: "string" },
        { name: "tld", required: true, type: "string" },
      ] },
    ]
  }, input);
}
