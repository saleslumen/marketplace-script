/**
 * POST /restful/v2/aftermarket/auctions/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#add_user_auction
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} [input.currency]
 * @param {number} input.starting_price
 * @param {string} [input.description]
 * @param {string} [input.google_analytics_id]
 * @param {boolean} [input.auto_relist]
 * @param {boolean} [input.can_installment]
 * @param {number} [input.max_installment_month]
 * @param {boolean} [input.revert_previous_dns]
 * @returns {Promise<Object>}
 */
async function addUserAuction(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/auctions/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "currency", in: "body", type: "string" },
      { name: "starting_price", in: "body", required: true, type: "integer" },
      { name: "description", in: "body", type: "string" },
      { name: "google_analytics_id", in: "body", type: "string" },
      { name: "auto_relist", in: "body", type: "boolean" },
      { name: "can_installment", in: "body", type: "boolean" },
      { name: "max_installment_month", in: "body", type: "integer" },
      { name: "revert_previous_dns", in: "body", type: "boolean" },
    ]
  }, input);
}
