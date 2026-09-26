/**
 * POST /restful/v2/aftermarket/expired_closeouts/{domain_name}/purchase
 * @see https://www.dynadot.com/domain/api-document#buy_expired_closeout_domain
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} [input.currency]
 * @returns {Promise<Object>}
 */
async function buyExpiredCloseoutDomain(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/expired_closeouts/{domain_name}/purchase",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "currency", in: "body", type: "string" },
    ]
  }, input);
}
