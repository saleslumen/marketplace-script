/**
 * POST /restful/v2/aftermarket/listings/{domain_name}/buy_it_now
 * @see https://www.dynadot.com/domain/api-document#buy_it_now
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} [input.currency]
 * @param {number} [input.price_to_verify]
 * @returns {Promise<Object>}
 */
async function buyItNow(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/listings/{domain_name}/buy_it_now",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "currency", in: "body", type: "string" },
      { name: "price_to_verify", in: "body", type: "integer" },
    ]
  }, input);
}
