/**
 * @description Session live URLs. GET /v1/sessions/{id}/debug.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} debuggerFullscreenUrl, debuggerUrl, pages, and wsUrl
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function sessionLiveUrls(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/sessions/${encodeURIComponent(located.id)}/debug`, "GET");
}
