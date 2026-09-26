/**
 * DELETE /restful/v2/nameservers/{nameserver}
 * @see https://www.dynadot.com/domain/api-document#nameserver_delete
 * @param {Object} input
 * @param {string|number} input.nameserver
 * @returns {Promise<Object>}
 */
async function deleteNameserver(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/nameservers/{nameserver}",
    fields: [
      { name: "nameserver", in: "path", required: true, type: "path" },
    ]
  }, input);
}
