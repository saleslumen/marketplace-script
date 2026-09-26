/**
 * GET /restful/v2/aftermarket/pay_links/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#get_express_pay_link
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function getExpressPayLink(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/pay_links/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
