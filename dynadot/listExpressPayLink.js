/**
 * GET /restful/v2/aftermarket/pay_links
 * @see https://www.dynadot.com/domain/api-document#list_express_pay_link
 * @param {Object} [input]
 * @param {string} [input.status]
 * @param {number} [input.page]
 * @param {number} [input.page_size]
 * @returns {Promise<Object>}
 */
async function listExpressPayLink(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/pay_links",
    fields: [
      { name: "status", in: "query", type: "string" },
      { name: "page", in: "query", type: "integer" },
      { name: "page_size", in: "query", type: "integer" },
    ]
  }, input);
}
