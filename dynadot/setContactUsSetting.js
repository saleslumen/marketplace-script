/**
 * PUT /restful/v2/contacts/{contact_id}/set_us_setting
 * @see https://www.dynadot.com/domain/api-document#set_contact_us_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact_extension
 * @param {string} input.contact_extension.intended_usage
 * @param {string} input.contact_extension.registrant_type
 * @param {string} input.contact_extension.tld
 * @returns {Promise<Object>}
 */
async function setContactUsSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}/set_us_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_extension", in: "body", required: true, type: "object", fields: [
        { name: "intended_usage", required: true, type: "string" },
        { name: "registrant_type", required: true, type: "string" },
        { name: "tld", required: true, type: "string" },
      ] },
    ]
  }, input);
}
