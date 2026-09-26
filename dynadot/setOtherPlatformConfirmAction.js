/**
 * POST /restful/v2/aftermarket/domains/{domain_name}/opt_in_fast_transfer
 * @see https://www.dynadot.com/domain/api-document#set_other_platform_confirm_action
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.action
 * @param {string} input.platform_type
 * @returns {Promise<Object>}
 */
async function setOtherPlatformConfirmAction(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/domains/{domain_name}/opt_in_fast_transfer",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "action", in: "body", required: true, type: "string" },
      { name: "platform_type", in: "body", required: true, type: "string" },
    ]
  }, input);
}
