/**
 * PUT /restful/v2/accounts/default_renew_option
 * @see https://www.dynadot.com/domain/api-document#set_default_renew_option
 * @param {Object} input
 * @param {string} input.renew_option
 * @returns {Promise<Object>}
 */
async function setDefaultRenewOption(input) {
  return dynadotRest({
    method: "PUT",
    path: "/accounts/default_renew_option",
    fields: [
      { name: "renew_option", in: "body", required: true, type: "string" },
    ]
  }, input);
}
