/**
 * GET /restful/v2/domains/{domain_name}/suggestion_search
 * @see https://www.dynadot.com/domain/api-document#suggestion_search
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.tlds
 * @param {number} [input.max_count]
 * @param {boolean} [input.show_price]
 * @param {string} [input.currency]
 * @returns {Promise<Object>}
 */
async function suggestionSearch(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/{domain_name}/suggestion_search",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "tlds", in: "query", required: true, type: "string" },
      { name: "max_count", in: "query", type: "integer" },
      { name: "show_price", in: "query", type: "boolean" },
      { name: "currency", in: "query", type: "string" },
    ]
  }, input);
}
