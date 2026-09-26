/**
 * GET /restful/v2/contacts
 * @see https://www.dynadot.com/domain/api-document#contact_list
 * @param {Object} [input]
 * @param {string} [input.whois_verification_status]
 * @param {boolean} [input.in_use]
 * @param {string} [input.cnnic_cn_audit_status]
 * @param {number} [input.page_size]
 * @param {number} [input.page]
 * @returns {Promise<Object>}
 */
async function listContacts(input) {
  return dynadotRest({
    method: "GET",
    path: "/contacts",
    fields: [
      { name: "whois_verification_status", in: "query", type: "string" },
      { name: "in_use", in: "query", type: "boolean" },
      { name: "cnnic_cn_audit_status", in: "query", type: "string" },
      { name: "page_size", in: "query", type: "integer" },
      { name: "page", in: "query", type: "integer" },
    ]
  }, input);
}
