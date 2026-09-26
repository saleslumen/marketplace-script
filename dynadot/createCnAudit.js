/**
 * POST /restful/v2/contacts/{contact_id}/create_cn_audit
 * @see https://www.dynadot.com/domain/api-document#create_cn_audit
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {string} input.contact_type
 * @param {string} input.individual_id_type
 * @param {string} input.individual_url
 * @param {string} input.individual_license_id
 * @param {string} [input.enterprise_id_type]
 * @param {string} [input.enterprise_license_id]
 * @param {string} [input.enterprise_url]
 * @returns {Promise<Object>}
 */
async function createCnAudit(input) {
  return dynadotRest({
    method: "POST",
    path: "/contacts/{contact_id}/create_cn_audit",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_type", in: "body", required: true, type: "string" },
      { name: "individual_id_type", in: "body", required: true, type: "string" },
      { name: "individual_url", in: "body", required: true, type: "string" },
      { name: "individual_license_id", in: "body", required: true, type: "string" },
      { name: "enterprise_id_type", in: "body", type: "string" },
      { name: "enterprise_license_id", in: "body", type: "string" },
      { name: "enterprise_url", in: "body", type: "string" },
    ]
  }, input);
}
