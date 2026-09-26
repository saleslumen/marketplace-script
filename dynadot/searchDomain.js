/**
 * GET /restful/v2/domains/{domain_name}/search
 * @see https://www.dynadot.com/domain/api-document#search
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {boolean} [input.show_price]
 * @param {string} [input.currency]
 * @returns {Promise<Object>}
 */
async function searchDomain(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/{domain_name}/search",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "show_price", in: "query", type: "boolean" },
      { name: "currency", in: "query", type: "string" },
    ]
  }, input);
}
