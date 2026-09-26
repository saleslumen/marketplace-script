/**
 * GET /restful/v2/domains/{domain_name}/nameservers
 * @see https://www.dynadot.com/domain/api-document#get_nameserver
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function getNameservers(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/{domain_name}/nameservers",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
