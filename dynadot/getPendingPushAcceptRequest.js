/**
 * GET /restful/v2/domains/pending_accept_pushes
 * @see https://www.dynadot.com/domain/api-document#get_pending_push_accept_request
 * @param {Object} [input]
 * @returns {Promise<Object>}
 */
async function getPendingPushAcceptRequest(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/pending_accept_pushes",
    fields: []
  }, input);
}
