/**
 * @description Get session replay. GET /v1/sessions/{id}/replays.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} pages and pageCount
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function getSessionReplay(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/sessions/${encodeURIComponent(located.id)}/replays`, "GET");
}
