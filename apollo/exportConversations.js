/**
 * @description Export conversations. POST /conversations/export. https://docs.apollo.io/reference/export-conversations
 * @param {Object} input
 * @param {string} input.start_time
 * @param {string} input.end_time
 * @param {string} input.email
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when start_time, end_time, or email is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function exportConversations(input) {
  const req = requireObject(input);
  const body = { start_time: requireString(req, "start_time"), end_time: requireString(req, "end_time"), email: requireString(req, "email") };
  return apolloRequest("/conversations/export", "POST", body);
}
