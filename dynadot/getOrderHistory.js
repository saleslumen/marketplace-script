/**
 * GET /restful/v2/orders
 * @see https://www.dynadot.com/domain/api-document#order_get_history
 * @param {Object} input
 * @param {Array} [input.domain_name_list]
 * @param {Array} [input.order_id_list]
 * @param {string} input.search_type
 * @param {number} [input.start_time]
 * @param {number} [input.end_time]
 * @param {Array} [input.payment_method]
 * @returns {Promise<Object>}
 */
async function getOrderHistory(input) {
  return dynadotRest({
    method: "GET",
    path: "/orders",
    fields: [
      { name: "domain_name_list", in: "query", type: "list", item: "string" },
      { name: "order_id_list", in: "query", type: "list", item: "string" },
      { name: "search_type", in: "query", required: true, type: "string" },
      { name: "start_time", in: "query", type: "integer" },
      { name: "end_time", in: "query", type: "integer" },
      { name: "payment_method", in: "query", type: "list", item: "string" },
    ]
  }, input);
}
