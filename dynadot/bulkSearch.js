/**
 * GET /restful/v2/domains/bulk_search
 * @see https://www.dynadot.com/domain/api-document#bulk_search
 * @param {Object} input
 * @param {number} [input.timeout]
 * @param {boolean} [input.show_price]
 * @param {string} [input.currency]
 * @param {Array} input.domain_name_list
 * @returns {Promise<Object>}
 */
async function bulkSearch(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/bulk_search",
    fields: [
      { name: "timeout", in: "query", type: "integer" },
      { name: "show_price", in: "query", type: "boolean" },
      { name: "currency", in: "query", type: "string" },
      { name: "domain_name_list", in: "query", required: true, type: "list", item: "string" },
    ]
  }, input);
}
