/**
 * POST /restful/v2/aftermarket/{domain_name}/listing_other_registrar_domain
 * @see https://www.dynadot.com/domain/api-document#listing_other_registrar_domain
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.for_sale_type
 * @param {string} [input.currency]
 * @param {string} [input.listing_type]
 * @param {number} [input.buy_now_price]
 * @param {number} [input.asking_price]
 * @param {number} [input.reserve_price]
 * @param {number} [input.minimum_offer_price]
 * @param {boolean} [input.installment]
 * @param {number} [input.maximum_installments]
 * @param {string} [input.category]
 * @param {string} [input.sub_category]
 * @param {string} [input.description]
 * @param {string} [input.google_analytics_id]
 * @param {boolean} [input.use_for_sale_landing_page]
 * @param {boolean} [input.display_traffic]
 * @param {boolean} [input.display_more_listings]
 * @param {boolean} [input.display_trustpilot]
 * @param {string} [input.theme]
 * @returns {Promise<Object>}
 */
async function listingOtherRegistrarDomain(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/{domain_name}/listing_other_registrar_domain",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "for_sale_type", in: "body", required: true, type: "string" },
      { name: "currency", in: "body", type: "string" },
      { name: "listing_type", in: "body", type: "string" },
      { name: "buy_now_price", in: "body", type: "integer" },
      { name: "asking_price", in: "body", type: "integer" },
      { name: "reserve_price", in: "body", type: "integer" },
      { name: "minimum_offer_price", in: "body", type: "integer" },
      { name: "installment", in: "body", type: "boolean" },
      { name: "maximum_installments", in: "body", type: "integer" },
      { name: "category", in: "body", type: "string" },
      { name: "sub_category", in: "body", type: "string" },
      { name: "description", in: "body", type: "string" },
      { name: "google_analytics_id", in: "body", type: "string" },
      { name: "use_for_sale_landing_page", in: "body", type: "boolean" },
      { name: "display_traffic", in: "body", type: "boolean" },
      { name: "display_more_listings", in: "body", type: "boolean" },
      { name: "display_trustpilot", in: "body", type: "boolean" },
      { name: "theme", in: "body", type: "string" },
    ]
  }, input);
}
