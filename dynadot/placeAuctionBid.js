/**
 * POST /restful/v2/aftermarket/auctions/bids/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#place_auction_bid
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.currency
 * @param {number} input.bid_amount
 * @param {boolean} [input.is_backorder_auction]
 * @returns {Promise<Object>}
 */
async function placeAuctionBid(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/auctions/bids/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "currency", in: "body", required: true, type: "string" },
      { name: "bid_amount", in: "body", required: true, type: "double" },
      { name: "is_backorder_auction", in: "body", type: "boolean" },
    ]
  }, input);
}
