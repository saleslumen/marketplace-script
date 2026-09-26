/**
 * PUT /restful/v2/contacts/{contact_id}/set_hk_setting
 * @see https://www.dynadot.com/domain/api-document#set_contact_hk_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact_extension
 * @param {string} input.contact_extension.contact_category
 * @param {string} [input.contact_extension.individual_contact_type]
 * @param {string} [input.contact_extension.organization_contact_type]
 * @param {string} input.contact_extension.contact_document_number
 * @param {string} input.contact_extension.document_origin_country
 * @param {string} input.contact_extension.registrant_industry_type
 * @param {boolean} input.contact_extension.is_over_18
 * @param {string} [input.contact_extension.other_document]
 * @param {string} input.contact_extension.tld
 * @returns {Promise<Object>}
 */
async function setContactHkSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}/set_hk_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_extension", in: "body", required: true, type: "object", fields: [
        { name: "contact_category", required: true, type: "string" },
        { name: "individual_contact_type", type: "string" },
        { name: "organization_contact_type", type: "string" },
        { name: "contact_document_number", required: true, type: "string" },
        { name: "document_origin_country", required: true, type: "string" },
        { name: "registrant_industry_type", required: true, type: "string" },
        { name: "is_over_18", required: true, type: "boolean" },
        { name: "other_document", type: "string" },
        { name: "tld", required: true, type: "string" },
      ] },
    ]
  }, input);
}
