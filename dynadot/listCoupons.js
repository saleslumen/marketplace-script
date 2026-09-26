/**
 * GET /restful/v2/orders/coupons
 * @see https://www.dynadot.com/domain/api-document#list_coupons
 * @param {Object} input
 * @param {string} input.coupon_type
 * @returns {Promise<Object>}
 */
async function listCoupons(input) {
  return dynadotRest({
    method: "GET",
    path: "/orders/coupons",
    fields: [
      { name: "coupon_type", in: "query", required: true, type: "string" },
    ]
  }, input);
}
