/**
 * POST /restful/v2/aftermarket/backorders/requests/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#add_backorder_request
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function addBackorderRequest(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/backorders/requests/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
