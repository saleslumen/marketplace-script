/**
 * GET /restful/v2/aftermarket/auctions/bids
 * @see https://www.dynadot.com/domain/api-document#get_auction_bids
 * @param {Object} input
 * @param {string} input.currency
 * @param {number} input.page_size
 * @param {number} input.page
 * @returns {Promise<Object>}
 */
async function getAuctionBids(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/auctions/bids",
    fields: [
      { name: "currency", in: "query", required: true, type: "string" },
      { name: "page_size", in: "query", required: true, type: "integer" },
      { name: "page", in: "query", required: true, type: "integer" },
    ]
  }, input);
}
