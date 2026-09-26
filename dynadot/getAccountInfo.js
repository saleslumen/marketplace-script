/**
 * GET /restful/v2/accounts/info
 * @see https://www.dynadot.com/domain/api-document#get_info
 * @param {Object} [input]
 * @returns {Promise<Object>}
 */
async function getAccountInfo(input) {
  return dynadotRest({
    method: "GET",
    path: "/accounts/info",
    fields: []
  }, input);
}
