/**
 * DELETE /restful/v2/aftermarket/pay_links/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#delete_express_pay_link
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function deleteExpressPayLink(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/aftermarket/pay_links/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
