/**
 * @description Get a session. GET /v1/sessions/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} the Browserbase session, including connectUrl, seleniumRemoteUrl, and signingKey when Browserbase returns them
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function getSession(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/sessions/${encodeURIComponent(located.id)}`, "GET");
}
