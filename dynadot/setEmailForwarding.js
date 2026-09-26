/**
 * PUT /restful/v2/domains/{domain_name}/email_forwarding
 * @see https://www.dynadot.com/domain/api-document#set_email_forwarding
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.email_forward_type
 * @param {Array} [input.email_alias_list]
 * @param {string} [input.email_alias_list.username]
 * @param {string} [input.email_alias_list.email]
 * @param {Array} [input.email_exchange_list]
 * @param {string} [input.email_exchange_list.host]
 * @param {string} [input.email_exchange_list.distance]
 * @returns {Promise<Object>}
 */
async function setEmailForwarding(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/email_forwarding",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "email_forward_type", in: "body", required: true, type: "string" },
      { name: "email_alias_list", in: "body", type: "list", item: "object", fields: [
        { name: "username", type: "string" },
        { name: "email", type: "string" },
      ] },
      { name: "email_exchange_list", in: "body", type: "list", item: "object", fields: [
        { name: "host", type: "string" },
        { name: "distance", type: "string" },
      ] },
    ]
  }, input);
}
