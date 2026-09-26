/**
 * PUT /restful/v2/domains/{domain_name}/renew_option
 * @see https://www.dynadot.com/domain/api-document#set_renew_option
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.renew_option
 * @returns {Promise<Object>}
 */
async function setRenewOption(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/renew_option",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "renew_option", in: "body", required: true, type: "string" },
    ]
  }, input);
}
