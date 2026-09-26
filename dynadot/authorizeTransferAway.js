/**
 * POST /restful/v2/orders/{order_id}/authorize_transfer_away
 * @see https://www.dynadot.com/domain/api-document#authorize_transfer_away
 * @param {Object} input
 * @param {string|number} input.order_id
 * @param {string} input.domain_name
 * @param {boolean} input.approve
 * @returns {Promise<Object>}
 */
async function authorizeTransferAway(input) {
  return dynadotRest({
    method: "POST",
    path: "/orders/{order_id}/authorize_transfer_away",
    fields: [
      { name: "order_id", in: "path", required: true, type: "path" },
      { name: "domain_name", in: "body", required: true, type: "string" },
      { name: "approve", in: "body", required: true, type: "boolean" },
    ]
  }, input);
}
