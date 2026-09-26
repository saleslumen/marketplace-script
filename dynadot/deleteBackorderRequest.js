/**
 * DELETE /restful/v2/aftermarket/backorders/requests/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#delete_backorder_request
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function deleteBackorderRequest(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/aftermarket/backorders/requests/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
