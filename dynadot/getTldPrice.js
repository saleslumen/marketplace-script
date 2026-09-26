/**
 * GET /restful/v2/domains/get_tld_price
 * @see https://www.dynadot.com/domain/api-document#domain_get_tld_price
 * @param {Object} input
 * @param {string} input.currency
 * @param {number} [input.page]
 * @param {number} [input.page_size]
 * @param {string} [input.sort]
 * @param {boolean} [input.show_multi_year]
 * @param {Array} [input.tlds]
 * @returns {Promise<Object>}
 */
async function getTldPrice(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/get_tld_price",
    fields: [
      { name: "currency", in: "query", required: true, type: "string" },
      { name: "page", in: "query", type: "integer" },
      { name: "page_size", in: "query", type: "integer" },
      { name: "sort", in: "query", type: "string" },
      { name: "show_multi_year", in: "query", type: "boolean" },
      { name: "tlds", in: "query", type: "list", item: "string" },
    ]
  }, input);
}
