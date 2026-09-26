/**
 * GET /restful/v2/nameservers/{nameserver}
 * @see https://www.dynadot.com/domain/api-document#nameserver_get
 * @param {Object} input
 * @param {string|number} input.nameserver
 * @returns {Promise<Object>}
 */
async function getNameserver(input) {
  return dynadotRest({
    method: "GET",
    path: "/nameservers/{nameserver}",
    fields: [
      { name: "nameserver", in: "path", required: true, type: "path" },
    ]
  }, input);
}
