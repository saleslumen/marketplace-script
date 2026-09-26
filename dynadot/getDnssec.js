/**
 * GET /restful/v2/domains/{domain_name}/dnssec
 * @see https://www.dynadot.com/domain/api-document#get_dnssec
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function getDnssec(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/{domain_name}/dnssec",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
