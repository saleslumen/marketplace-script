/**
 * DELETE /restful/v2/domains/{domain_name}/grace_delete
 * @see https://www.dynadot.com/domain/api-document#grace_delete
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {boolean} [input.add_to_waiting_list]
 * @returns {Promise<Object>}
 */
async function graceDelete(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/domains/{domain_name}/grace_delete",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "add_to_waiting_list", in: "body", type: "boolean" },
    ]
  }, input);
}
