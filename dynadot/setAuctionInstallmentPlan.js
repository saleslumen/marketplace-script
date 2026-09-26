/**
 * POST /restful/v2/aftermarket/auctions/{domain_name}/installment_plan
 * @see https://www.dynadot.com/domain/api-document#set_auction_installment_plan
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.installment_status
 * @param {number} [input.installment_months]
 * @param {string} [input.currency]
 * @returns {Promise<Object>}
 */
async function setAuctionInstallmentPlan(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/auctions/{domain_name}/installment_plan",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "installment_status", in: "body", required: true, type: "string" },
      { name: "installment_months", in: "body", type: "integer" },
      { name: "currency", in: "body", type: "string" },
    ]
  }, input);
}
