/**
 * GET /restful/v2/domains/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#domain_info
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function getDomainInfo(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
