/**
 * PUT /restful/v2/accounts/clear_default_setting
 * @see https://www.dynadot.com/domain/api-document#clear_default_setting
 * @param {Object} input
 * @param {string} input.service_type
 * @returns {Promise<Object>}
 */
async function clearDefaultSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/accounts/clear_default_setting",
    fields: [
      { name: "service_type", in: "body", required: true, type: "string" },
    ]
  }, input);
}
