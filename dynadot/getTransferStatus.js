/**
 * GET /restful/v2/domains/{domain_name}/transfer_status
 * @see https://www.dynadot.com/domain/api-document#get_transfer_status
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.transfer_type
 * @returns {Promise<Object>}
 */
async function getTransferStatus(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/{domain_name}/transfer_status",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "transfer_type", in: "query", required: true, type: "string" },
    ]
  }, input);
}
