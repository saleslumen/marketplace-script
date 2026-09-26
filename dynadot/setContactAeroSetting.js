/**
 * PUT /restful/v2/contacts/{contact_id}/set_aero_setting
 * @see https://www.dynadot.com/domain/api-document#set_contact_aero_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact_extension
 * @param {string} input.contact_extension.membership_id
 * @param {string} input.contact_extension.membership_auth
 * @param {string} input.contact_extension.tld
 * @returns {Promise<Object>}
 */
async function setContactAeroSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}/set_aero_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_extension", in: "body", required: true, type: "object", fields: [
        { name: "membership_id", required: true, type: "string" },
        { name: "membership_auth", required: true, type: "string" },
        { name: "tld", required: true, type: "string" },
      ] },
    ]
  }, input);
}
