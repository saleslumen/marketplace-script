/**
 * POST /restful/v2/domains/{domain_name}/accept_push
 * @see https://www.dynadot.com/domain/api-document#accept_push
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.push_action
 * @returns {Promise<Object>}
 */
async function acceptPush(input) {
  return dynadotRest({
    method: "POST",
    path: "/domains/{domain_name}/accept_push",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "push_action", in: "body", required: true, type: "string" },
    ]
  }, input);
}
