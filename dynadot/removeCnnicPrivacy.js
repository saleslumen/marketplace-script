/**
 * DELETE /restful/v2/domains/{domain_name}/cnnic_privacy
 * @see https://www.dynadot.com/domain/api-document#remove_cnnic_privacy
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function removeCnnicPrivacy(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/domains/{domain_name}/cnnic_privacy",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
