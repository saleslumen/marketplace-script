/**
 * PUT /restful/v2/contacts/{contact_id}/set_ca_setting
 * @see https://www.dynadot.com/domain/api-document#set_contact_ca_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact_extension
 * @param {string} input.contact_extension.whois_type
 * @param {string} input.contact_extension.cira_language
 * @param {boolean} input.contact_extension.accept_cira_agreement
 * @param {string} input.contact_extension.tld
 * @returns {Promise<Object>}
 */
async function setContactCaSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}/set_ca_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_extension", in: "body", required: true, type: "object", fields: [
        { name: "whois_type", required: true, type: "string" },
        { name: "cira_language", required: true, type: "string" },
        { name: "accept_cira_agreement", required: true, type: "boolean" },
        { name: "tld", required: true, type: "string" },
      ] },
    ]
  }, input);
}
