/**
 * GET /restful/v2/email_hosting
 * @see https://www.dynadot.com/domain/api-document#list_email_hosting
 * @param {Object} [input]
 * @returns {Promise<Object>}
 */
async function listEmailHosting(input) {
  return dynadotRest({
    method: "GET",
    path: "/email_hosting",
    fields: []
  }, input);
}
