/**
 * POST /restful/v2/orders/{order_id}/update_transfer_auth_code
 * @see https://www.dynadot.com/domain/api-document#set_transfer_auth_code
 * @param {Object} input
 * @param {string|number} input.order_id
 * @param {string} input.domain_name
 * @param {string} input.auth_code
 * @returns {Promise<Object>}
 */
async function setTransferAuthCode(input) {
  return dynadotRest({
    method: "POST",
    path: "/orders/{order_id}/update_transfer_auth_code",
    fields: [
      { name: "order_id", in: "path", required: true, type: "path" },
      { name: "domain_name", in: "body", required: true, type: "string" },
      { name: "auth_code", in: "body", required: true, type: "string" },
    ]
  }, input);
}
