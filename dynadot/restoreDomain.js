/**
 * POST /restful/v2/domains/{domain_name}/restore
 * @see https://www.dynadot.com/domain/api-document#restore
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} [input.currency]
 * @param {string} [input.coupon_code]
 * @returns {Promise<Object>}
 */
async function restoreDomain(input) {
  return dynadotRest({
    method: "POST",
    path: "/domains/{domain_name}/restore",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "currency", in: "body", type: "string" },
      { name: "coupon_code", in: "body", type: "string" },
    ]
  }, input);
}
