/**
 * PUT /restful/v2/domains/{domain_name}/hosts
 * @see https://www.dynadot.com/domain/api-document#set_hosting
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.hosting_type
 * @param {boolean} input.is_model_view
 * @returns {Promise<Object>}
 */
async function setHosting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/hosts",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "hosting_type", in: "body", required: true, type: "string" },
      { name: "is_model_view", in: "body", required: true, type: "boolean" },
    ]
  }, input);
}
