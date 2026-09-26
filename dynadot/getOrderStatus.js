/**
 * GET /restful/v2/orders/{order_id}
 * @see https://www.dynadot.com/domain/api-document#order_get_status
 * @param {Object} input
 * @param {string|number} input.order_id
 * @returns {Promise<Object>}
 */
async function getOrderStatus(input) {
  return dynadotRest({
    method: "GET",
    path: "/orders/{order_id}",
    fields: [
      { name: "order_id", in: "path", required: true, type: "path" },
    ]
  }, input);
}
