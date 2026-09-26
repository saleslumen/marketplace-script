/**
 * @description Check email send status. POST /emailer_messages/email_send_status. https://docs.apollo.io/reference/check-email-send-status
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getEmailSendStatus(input) {
  const req = requireObject(input);
  return apolloRequest("/emailer_messages/email_send_status", "POST", { id: requireString(req, "id") });
}
