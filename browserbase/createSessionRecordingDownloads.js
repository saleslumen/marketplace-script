/**
 * @description Create session recording downloads. POST /v1/sessions/{id}/recording/downloads.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} downloads
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function createSessionRecordingDownloads(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/sessions/${encodeURIComponent(located.id)}/recording/downloads`, "POST");
}
