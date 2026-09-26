/**
 * POST /restful/v2/aftermarket/pay_links
 * @see https://www.dynadot.com/domain/api-document#create_express_pay_link
 * @param {Object} input
 * @param {string} input.currency
 * @param {string} input.domain_name
 * @param {string} input.price
 * @param {boolean} input.installment_enabled
 * @param {string} [input.installment_months]
 * @param {string} input.link_expiration
 * @returns {Promise<Object>}
 */
async function createExpressPayLink(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/pay_links",
    fields: [
      { name: "currency", in: "body", required: true, type: "string" },
      { name: "domain_name", in: "body", required: true, type: "string" },
      { name: "price", in: "body", required: true, type: "string" },
      { name: "installment_enabled", in: "body", required: true, type: "boolean" },
      { name: "installment_months", in: "body", type: "string" },
      { name: "link_expiration", in: "body", required: true, type: "string" },
    ]
  }, input);
}
