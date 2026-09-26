/**
 * POST /restful/v2/aftermarket/buy_afternic_domain
 * @see https://www.dynadot.com/domain/api-document#buy_afternic_domain
 * @param {Object} input
 * @param {string} input.domain_name
 * @param {string} [input.currency]
 * @returns {Promise<Object>}
 */
async function buyAfternicDomain(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/buy_afternic_domain",
    fields: [
      { name: "domain_name", in: "body", required: true, type: "string" },
      { name: "currency", in: "body", type: "string" },
    ]
  }, input);
}
