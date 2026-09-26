/**
 * GET /restful/v2/aftermarket/listings/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#get_listing_item
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.currency
 * @returns {Promise<Object>}
 */
async function getListingItem(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/listings/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "currency", in: "query", required: true, type: "string" },
    ]
  }, input);
}
