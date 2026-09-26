/**
 * POST /restful/v2/nameservers/register
 * @see https://www.dynadot.com/domain/api-document#nameserver_register
 * @param {Object} input
 * @param {Object} input.nameserver
 * @param {string} input.nameserver.server_name
 * @param {string} input.nameserver.ip
 * @returns {Promise<Object>}
 */
async function registerNameserver(input) {
  return dynadotRest({
    method: "POST",
    path: "/nameservers/register",
    fields: [
      { name: "nameserver", in: "body", required: true, type: "object", fields: [
        { name: "server_name", required: true, type: "string" },
        { name: "ip", required: true, type: "string" },
      ] },
    ]
  }, input);
}
