/**
 * @description Get replay page. GET /v1/sessions/{id}/replays/{pageId}. Returns the HLS playlist text.
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.pageId - 1 to 3 digits
 * @returns {string} the application/vnd.apple.mpegurl playlist
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when input is invalid or Browserbase rejects the request
 */
async function getReplayPage(input) {
  const located = requirePathId(input);
  const pageId = requirePageId(located.req.pageId);
  return browserbaseRequest(`/v1/sessions/${encodeURIComponent(located.id)}/replays/${encodeURIComponent(pageId)}`, "GET", undefined, {
    accept: "application/vnd.apple.mpegurl",
    raw: true,
  });
}
