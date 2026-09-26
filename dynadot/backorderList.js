/**
 * GET /restful/v2/aftermarket/backorders
 * @see https://www.dynadot.com/domain/api-document#backorder_list
 * @param {Object} [input]
 * @param {string} [input.currency]
 * @param {string} [input.tlds]
 * @param {number} [input.page]
 * @param {number} [input.page_size]
 * @returns {Promise<Object>}
 */
async function backorderList(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/backorders",
    fields: [
      { name: "currency", in: "query", type: "string" },
      { name: "tlds", in: "query", type: "string" },
      { name: "page", in: "query", type: "integer" },
      { name: "page_size", in: "query", type: "integer" },
    ]
  }, input);
}
