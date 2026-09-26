/**
 * @description Check email stats. GET /emailer_messages/{id}/activities. https://docs.apollo.io/reference/check-email-stats
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getEmailStats(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  return apolloRequest(`/emailer_messages/${encodeURIComponent(id)}/activities`, "GET");
}
