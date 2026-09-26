/**
 * POST /restful/v2/domains/{domain_name}/renew
 * @see https://www.dynadot.com/domain/api-document#renew
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {number} input.duration
 * @param {number} input.year
 * @param {string} [input.currency]
 * @param {string} [input.coupon]
 * @param {boolean} [input.no_renew_if_late_renew_fee_needed]
 * @returns {Promise<Object>}
 */
async function renewDomain(input) {
  return dynadotRest({
    method: "POST",
    path: "/domains/{domain_name}/renew",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "duration", in: "body", required: true, type: "integer" },
      { name: "year", in: "body", required: true, type: "integer" },
      { name: "currency", in: "body", type: "string" },
      { name: "coupon", in: "body", type: "string" },
      { name: "no_renew_if_late_renew_fee_needed", in: "body", type: "boolean" },
    ]
  }, input);
}
