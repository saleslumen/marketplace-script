/**
 * @description Get email content. POST /emailer_messages/get_content. https://docs.apollo.io/reference/get-email-content
 * @param {Object} input
 * @param {string[]} input.ids
 * @param {string} [input.body_format]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when ids is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function getEmailContent(input) {
  const req = requireObject(input);
  const body = { ids: requireStringList(req, "ids") };
  if (req.body_format !== undefined) body.body_format = checkValue("body_format", req.body_format, "string");
  return apolloRequest("/emailer_messages/get_content", "POST", body);
}
