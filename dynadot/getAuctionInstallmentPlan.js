/**
 * GET /restful/v2/aftermarket/auctions/{domain_name}/installment_plan
 * @see https://www.dynadot.com/domain/api-document#get_auction_installment_plan
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} [input.currency]
 * @returns {Promise<Object>}
 */
async function getAuctionInstallmentPlan(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/auctions/{domain_name}/installment_plan",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "currency", in: "query", type: "string" },
    ]
  }, input);
}
