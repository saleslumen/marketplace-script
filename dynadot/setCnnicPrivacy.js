/**
 * PUT /restful/v2/domains/{domain_name}/cnnic_privacy
 * @see https://www.dynadot.com/domain/api-document#set_cnnic_privacy
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.display_email
 * @returns {Promise<Object>}
 */
async function setCnnicPrivacy(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/cnnic_privacy",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "display_email", in: "body", required: true, type: "string" },
    ]
  }, input);
}
