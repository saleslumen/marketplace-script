/**
 * GET /restful/v2/aftermarket/auctions/open
 * @see https://www.dynadot.com/domain/api-document#get_open_auctions
 * @param {Object} input
 * @param {string} input.currency
 * @param {Array} [input.auction_types]
 * @param {number} input.page_size
 * @param {number} input.page
 * @param {string} [input.sort]
 * @param {boolean} [input.has_bids]
 * @returns {Promise<Object>}
 */
async function getOpenAuctions(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/auctions/open",
    fields: [
      { name: "currency", in: "query", required: true, type: "string" },
      { name: "auction_types", in: "query", type: "list", item: "string" },
      { name: "page_size", in: "query", required: true, type: "integer" },
      { name: "page", in: "query", required: true, type: "integer" },
      { name: "sort", in: "query", type: "string" },
      { name: "has_bids", in: "query", type: "boolean" },
    ]
  }, input);
}
