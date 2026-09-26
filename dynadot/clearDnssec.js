/**
 * DELETE /restful/v2/domains/{domain_name}/dnssec
 * @see https://www.dynadot.com/domain/api-document#clear_dnssec
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function clearDnssec(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/domains/{domain_name}/dnssec",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
