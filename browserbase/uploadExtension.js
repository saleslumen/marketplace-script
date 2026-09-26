/**
 * @description Upload an extension. POST /v1/extensions as multipart/form-data field file.
 * @param {Object} input
 * @param {string} input.file
 * @returns {Object} the Browserbase extension
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when file is missing or Browserbase rejects the request
 */
async function uploadExtension(input) {
  const req = requireObjectInput(input);
  if (!defined(req, "file")) fail("file is required");
  return browserbaseRequest("/v1/extensions", "POST", undefined, { multipart: true, file: req.file });
}
