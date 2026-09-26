/**
 * GET /restful/v2/domains/{domain_name}/transfer_auth_code
 * @see https://www.dynadot.com/domain/api-document#get_transfer_auth_code
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {boolean} [input.new_code]
 * @param {boolean} [input.unlock_domain_for_transfer]
 * @returns {Promise<Object>}
 */
async function getTransferAuthCode(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/{domain_name}/transfer_auth_code",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "new_code", in: "query", type: "boolean" },
      { name: "unlock_domain_for_transfer", in: "query", type: "boolean" },
    ]
  }, input);
}
