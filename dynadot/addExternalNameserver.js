/**
 * POST /restful/v2/nameservers/{nameserver}/add_external
 * @see https://www.dynadot.com/domain/api-document#nameserver_add_external
 * @param {Object} input
 * @param {string|number} input.nameserver
 * @returns {Promise<Object>}
 */
async function addExternalNameserver(input) {
  return dynadotRest({
    method: "POST",
    path: "/nameservers/{nameserver}/add_external",
    fields: [
      { name: "nameserver", in: "path", required: true, type: "path" },
    ]
  }, input);
}
