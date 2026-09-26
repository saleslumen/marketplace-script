/**
 * POST /restful/v2/aftermarket/buy_sedo_domain
 * @see https://www.dynadot.com/domain/api-document#buy_sedo_domain
 * @param {Object} input
 * @param {string} input.domain_name
 * @param {string} [input.currency]
 * @returns {Promise<Object>}
 */
async function buySedoDomain(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/buy_sedo_domain",
    fields: [
      { name: "domain_name", in: "body", required: true, type: "string" },
      { name: "currency", in: "body", type: "string" },
    ]
  }, input);
}
