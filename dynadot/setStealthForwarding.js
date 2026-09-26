/**
 * PUT /restful/v2/domains/{domain_name}/stealth_forwarding
 * @see https://www.dynadot.com/domain/api-document#set_stealth_forwarding
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.stealth_url
 * @param {string} input.stealth_title
 * @returns {Promise<Object>}
 */
async function setStealthForwarding(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/stealth_forwarding",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "stealth_url", in: "body", required: true, type: "string" },
      { name: "stealth_title", in: "body", required: true, type: "string" },
    ]
  }, input);
}
