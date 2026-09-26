/**
 * PUT /restful/v2/accounts/default_stealth_forwarding
 * @see https://www.dynadot.com/domain/api-document#set_default_stealth_forwarding
 * @param {Object} input
 * @param {string} input.stealth_url
 * @param {string} [input.stealth_title]
 * @returns {Promise<Object>}
 */
async function setDefaultStealthForwarding(input) {
  return dynadotRest({
    method: "PUT",
    path: "/accounts/default_stealth_forwarding",
    fields: [
      { name: "stealth_url", in: "body", required: true, type: "string" },
      { name: "stealth_title", in: "body", type: "string" },
    ]
  }, input);
}
