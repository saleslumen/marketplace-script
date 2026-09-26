/**
 * PUT /restful/v2/contacts/{contact_id}/set_no_setting
 * @see https://www.dynadot.com/domain/api-document#set_contact_no_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact_extension
 * @param {string} input.contact_extension.contact_type
 * @param {string} input.contact_extension.national_or_organization_number
 * @param {string} input.contact_extension.tld
 * @returns {Promise<Object>}
 */
async function setContactNoSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}/set_no_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_extension", in: "body", required: true, type: "object", fields: [
        { name: "contact_type", required: true, type: "string" },
        { name: "national_or_organization_number", required: true, type: "string" },
        { name: "tld", required: true, type: "string" },
      ] },
    ]
  }, input);
}
