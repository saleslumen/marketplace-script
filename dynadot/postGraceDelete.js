/**
 * DELETE /restful/v2/domains/{domain_name}/post_grace_delete
 * @see https://www.dynadot.com/domain/api-document#post_grace_delete
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function postGraceDelete(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/domains/{domain_name}/post_grace_delete",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
