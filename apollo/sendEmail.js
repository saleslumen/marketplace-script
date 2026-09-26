/**
 * @description Send email now. POST /emailer_messages/{id}/send_now. https://docs.apollo.io/reference/send-email-now
 * @param {Object} input
 * @param {string} input.id
 * @param {string} [input.surface]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function sendEmail(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  const body = pickFields(req, [["surface", "string"]]);
  return apolloRequest(`/emailer_messages/${encodeURIComponent(id)}/send_now`, "POST", Object.keys(body).length ? body : undefined);
}
