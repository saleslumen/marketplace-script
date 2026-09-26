/**
 * POST /restful/v2/orders/{order_id}/cancel_transfer
 * @see https://www.dynadot.com/domain/api-document#cancel_transfer
 * @param {Object} input
 * @param {string|number} input.order_id
 * @param {string} input.domain_name
 * @returns {Promise<Object>}
 */
async function cancelTransfer(input) {
  return dynadotRest({
    method: "POST",
    path: "/orders/{order_id}/cancel_transfer",
    fields: [
      { name: "order_id", in: "path", required: true, type: "path" },
      { name: "domain_name", in: "body", required: true, type: "string" },
    ]
  }, input);
}
