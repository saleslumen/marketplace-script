/**
 * PUT /restful/v2/domains/{domain_name}/nameservers
 * @see https://www.dynadot.com/domain/api-document#set_nameserver
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {Array} input.nameserver_list
 * @returns {Promise<Object>}
 */
async function setNameservers(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/nameservers",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "nameserver_list", in: "body", required: true, type: "list", item: "string" },
    ]
  }, input);
}
