/**
 * GET /restful/v2/contacts/{contact_id}/get_cn_audit_status
 * @see https://www.dynadot.com/domain/api-document#get_cn_audit_status
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {boolean} input.is_gtld
 * @returns {Promise<Object>}
 */
async function getCnAuditStatus(input) {
  return dynadotRest({
    method: "GET",
    path: "/contacts/{contact_id}/get_cn_audit_status",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "is_gtld", in: "query", required: true, type: "boolean" },
    ]
  }, input);
}
