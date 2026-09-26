/**
 * GET /restful/v2/nameservers
 * @see https://www.dynadot.com/domain/api-document#nameserver_list
 * @param {Object} [input]
 * @returns {Promise<Object>}
 */
async function listNameservers(input) {
  return dynadotRest({
    method: "GET",
    path: "/nameservers",
    fields: []
  }, input);
}
