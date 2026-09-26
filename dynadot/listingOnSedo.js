/**
 * POST /restful/v2/aftermarket/listing_on_sedo
 * @see https://www.dynadot.com/domain/api-document#listing_on_sedo
 * @param {Object} input
 * @param {string} input.domain_name
 * @param {string} input.price
 * @param {string} input.currency
 * @param {boolean} input.accept_sedo_agreement
 * @returns {Promise<Object>}
 */
async function listingOnSedo(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/listing_on_sedo",
    fields: [
      { name: "domain_name", in: "body", required: true, type: "string" },
      { name: "price", in: "body", required: true, type: "string" },
      { name: "currency", in: "body", required: true, type: "string" },
      { name: "accept_sedo_agreement", in: "body", required: true, type: "boolean" },
    ]
  }, input);
}
