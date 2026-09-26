/**
 * POST /restful/v2/aftermarket/auctions/{auction_id}/close
 * @see https://www.dynadot.com/domain/api-document#close_auction
 * @param {Object} input
 * @param {string|number} input.auction_id
 * @returns {Promise<Object>}
 */
async function closeAuction(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/auctions/{auction_id}/close",
    fields: [
      { name: "auction_id", in: "path", required: true, type: "path" },
    ]
  }, input);
}
