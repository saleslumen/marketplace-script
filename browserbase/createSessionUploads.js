/**
 * @description Create session uploads. POST /v1/sessions/{id}/uploads as multipart/form-data field file.
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.file
 * @returns {Object} message
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when input is invalid or Browserbase rejects the request
 */
async function createSessionUploads(input) {
  const located = requirePathId(input);
  if (!defined(located.req, "file")) fail("file is required");
  return browserbaseRequest(`/v1/sessions/${encodeURIComponent(located.id)}/uploads`, "POST", undefined, { multipart: true, file: located.req.file });
}
