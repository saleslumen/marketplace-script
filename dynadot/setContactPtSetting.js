/**
 * PUT /restful/v2/contacts/{contact_id}/set_pt_setting
 * @see https://www.dynadot.com/domain/api-document#set_contact_pt_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact_extension
 * @param {string} input.contact_extension.vat_or_identity
 * @param {string} [input.contact_extension.external_registry_contact_id]
 * @param {boolean} input.contact_extension.has_registry_whois_privacy
 * @param {string} input.contact_extension.tld
 * @returns {Promise<Object>}
 */
async function setContactPtSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}/set_pt_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_extension", in: "body", required: true, type: "object", fields: [
        { name: "vat_or_identity", required: true, type: "string" },
        { name: "external_registry_contact_id", type: "string" },
        { name: "has_registry_whois_privacy", required: true, type: "boolean" },
        { name: "tld", required: true, type: "string" },
      ] },
    ]
  }, input);
}
