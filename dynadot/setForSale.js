/**
 * PUT /restful/v2/aftermarkets/domains/{domain_name}/for_sales
 * @see https://www.dynadot.com/domain/api-document#set_for_sale
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.for_sale_type
 * @param {string} [input.currency]
 * @param {string} input.listing_type
 * @param {string} [input.price]
 * @param {string} [input.minimum_offer_price]
 * @param {string} [input.installment]
 * @param {number} [input.maximum_installments]
 * @param {string} [input.category]
 * @param {string} [input.sub_category]
 * @param {string} input.description
 * @param {boolean} [input.allow_seo_index]
 * @returns {Promise<Object>}
 */
async function setForSale(input) {
  return dynadotRest({
    method: "PUT",
    path: "/aftermarkets/domains/{domain_name}/for_sales",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "for_sale_type", in: "body", required: true, type: "string" },
      { name: "currency", in: "body", type: "string" },
      { name: "listing_type", in: "body", required: true, type: "string" },
      { name: "price", in: "body", type: "string" },
      { name: "minimum_offer_price", in: "body", type: "string" },
      { name: "installment", in: "body", type: "string" },
      { name: "maximum_installments", in: "body", type: "integer" },
      { name: "category", in: "body", type: "string" },
      { name: "sub_category", in: "body", type: "string" },
      { name: "description", in: "body", required: true, type: "string" },
      { name: "allow_seo_index", in: "body", type: "boolean" },
    ]
  }, input);
}
