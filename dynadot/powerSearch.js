/**
 * GET /restful/v2/domains/{domain_name}/power_search_new
 * @see https://www.dynadot.com/domain/api-document#power_search
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {number} [input.limit]
 * @param {number} [input.cursor]
 * @param {string} [input.status]
 * @returns {Promise<Object>}
 */
async function powerSearch(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/{domain_name}/power_search_new",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "limit", in: "query", type: "integer" },
      { name: "cursor", in: "query", type: "integer" },
      { name: "status", in: "query", type: "string" },
    ]
  }, input);
}
