/**
 * PUT /restful/v2/accounts/default_hosts
 * @see https://www.dynadot.com/domain/api-document#set_default_hosting
 * @param {Object} input
 * @param {string} input.hosting_type
 * @returns {Promise<Object>}
 */
async function setDefaultHosting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/accounts/default_hosts",
    fields: [
      { name: "hosting_type", in: "body", required: true, type: "string" },
    ]
  }, input);
}
