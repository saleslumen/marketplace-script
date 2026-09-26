/**
 * GET /restful/v2/domains/{domain_name}/records
 * @see https://www.dynadot.com/domain/api-document#get_dns
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function getDns(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/{domain_name}/records",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
