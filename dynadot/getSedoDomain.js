/**
 * GET /restful/v2/aftermarket/get_sedo_domain
 * @see https://www.dynadot.com/domain/api-document#get_sedo_domain
 * @param {Object} input
 * @param {string} input.domain_name
 * @param {Array} [input.tlds]
 * @param {number} input.max_result
 * @param {string} [input.currency]
 * @returns {Promise<Object>}
 */
async function getSedoDomain(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/get_sedo_domain",
    fields: [
      { name: "domain_name", in: "query", required: true, type: "string" },
      { name: "tlds", in: "query", type: "list", item: "string" },
      { name: "max_result", in: "query", required: true, type: "integer" },
      { name: "currency", in: "query", type: "string" },
    ]
  }, input);
}
