/**
 * PUT /restful/v2/domains/{domain_name}/privacy
 * @see https://www.dynadot.com/domain/api-document#set_privacy
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.privacy_level
 * @returns {Promise<Object>}
 */
async function setPrivacy(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/privacy",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "privacy_level", in: "body", required: true, type: "string" },
    ]
  }, input);
}
