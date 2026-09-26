/**
 * PUT /restful/v2/accounts/default_domain_forwarding
 * @see https://www.dynadot.com/domain/api-document#set_default_domain_forwarding
 * @param {Object} input
 * @param {string} input.forward_url
 * @param {boolean} [input.is_temporary]
 * @returns {Promise<Object>}
 */
async function setDefaultDomainForwarding(input) {
  return dynadotRest({
    method: "PUT",
    path: "/accounts/default_domain_forwarding",
    fields: [
      { name: "forward_url", in: "body", required: true, type: "string" },
      { name: "is_temporary", in: "body", type: "boolean" },
    ]
  }, input);
}
