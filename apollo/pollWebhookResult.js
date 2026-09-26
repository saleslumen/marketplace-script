/**
 * @description Poll webhook result. GET /webhook_result/{request_id}. https://docs.apollo.io/reference/poll-webhook-result
 * @param {Object} input
 * @param {string} input.request_id Signed 64-bit id as a decimal string, optionally with a leading -.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when request_id is missing or not a decimal string.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function pollWebhookResult(input) {
  const req = requireObject(input);
  const requestId = requireDecimalString(req, "request_id");
  return apolloRequest(`/webhook_result/${encodeURIComponent(requestId)}`, "GET");
}
