/**
 * DELETE /restful/v2/email_hosting/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#delete_email_hosting
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} [input.domain_name]
 * @returns {Promise<Object>}
 */
async function deleteEmailHosting(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/email_hosting/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "domain_name", in: "body", type: "string" },
    ]
  }, input);
}
