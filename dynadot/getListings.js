/**
 * GET /restful/v2/aftermarket/listings
 * @see https://www.dynadot.com/domain/api-document#get_listings
 * @param {Object} input
 * @param {string} input.currency
 * @param {boolean} [input.exclude_pending_sale]
 * @param {boolean} [input.show_other_registrar]
 * @param {number} input.page_size
 * @param {number} input.page
 * @returns {Promise<Object>}
 */
async function getListings(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/listings",
    fields: [
      { name: "currency", in: "query", required: true, type: "string" },
      { name: "exclude_pending_sale", in: "query", type: "boolean" },
      { name: "show_other_registrar", in: "query", type: "boolean" },
      { name: "page_size", in: "query", required: true, type: "integer" },
      { name: "page", in: "query", required: true, type: "integer" },
    ]
  }, input);
}
