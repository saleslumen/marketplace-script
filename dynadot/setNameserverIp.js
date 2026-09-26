/**
 * PUT /restful/v2/nameservers/{nameserver}/set_ip
 * @see https://www.dynadot.com/domain/api-document#nameserver_set_ip
 * @param {Object} input
 * @param {string|number} input.nameserver
 * @param {Array} input.ip_list
 * @returns {Promise<Object>}
 */
async function setNameserverIp(input) {
  return dynadotRest({
    method: "PUT",
    path: "/nameservers/{nameserver}/set_ip",
    fields: [
      { name: "nameserver", in: "path", required: true, type: "path" },
      { name: "ip_list", in: "body", required: true, type: "list", item: "string" },
    ]
  }, input);
}
