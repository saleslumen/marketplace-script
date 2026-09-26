/**
 * PUT /restful/v2/domains/{domain_name}/domain_forwarding
 * @see https://www.dynadot.com/domain/api-document#set_domain_forwarding
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.forward_url
 * @param {boolean} [input.is_temporary]
 * @param {boolean} [input.enable_domain_variable]
 * @param {boolean} [input.enable_wildcard_forwarding]
 * @returns {Promise<Object>}
 */
async function setDomainForwarding(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/domain_forwarding",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "forward_url", in: "body", required: true, type: "string" },
      { name: "is_temporary", in: "body", type: "boolean" },
      { name: "enable_domain_variable", in: "body", type: "boolean" },
      { name: "enable_wildcard_forwarding", in: "body", type: "boolean" },
    ]
  }, input);
}
