/**
 * POST /restful/v2/aftermarket/listing_on_afternic
 * @see https://www.dynadot.com/domain/api-document#listing_on_afternic
 * @param {Object} input
 * @param {string} input.domain_name
 * @param {string} input.usd_price
 * @returns {Promise<Object>}
 */
async function listingOnAfternic(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/listing_on_afternic",
    fields: [
      { name: "domain_name", in: "body", required: true, type: "string" },
      { name: "usd_price", in: "body", required: true, type: "string" },
    ]
  }, input);
}
