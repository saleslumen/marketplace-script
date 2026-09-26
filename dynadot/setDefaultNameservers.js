/**
 * PUT /restful/v2/accounts/default_nameservers
 * @see https://www.dynadot.com/domain/api-document#set_default_nameservers
 * @param {Object} input
 * @param {Array} input.nameserver_list
 * @returns {Promise<Object>}
 */
async function setDefaultNameservers(input) {
  return dynadotRest({
    method: "PUT",
    path: "/accounts/default_nameservers",
    fields: [
      { name: "nameserver_list", in: "body", required: true, type: "list", item: "string" },
    ]
  }, input);
}
