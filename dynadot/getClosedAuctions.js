/**
 * GET /restful/v2/aftermarket/auctions/closed
 * @see https://www.dynadot.com/domain/api-document#get_closed_auctions
 * @param {Object} input
 * @param {string} input.currency
 * @param {number} input.start_time
 * @param {number} input.end_time
 * @returns {Promise<Object>}
 */
async function getClosedAuctions(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/auctions/closed",
    fields: [
      { name: "currency", in: "query", required: true, type: "string" },
      { name: "start_time", in: "query", required: true, type: "integer" },
      { name: "end_time", in: "query", required: true, type: "integer" },
    ]
  }, input);
}
