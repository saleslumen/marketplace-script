/**
 * @description Get a download. GET /v1/downloads/{id}. Accept application/json returns metadata. Accept application/octet-stream returns the file text.
 * @param {Object} input
 * @param {string} input.id
 * @param {"application/json"|"application/octet-stream"} [input.Accept]
 * @returns {Object|string} download metadata, or the file body when Accept is application/octet-stream
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when input is invalid or Browserbase rejects the request
 */
async function getDownload(input) {
  const located = requirePathId(input);
  let accept = "application/json";
  if (defined(located.req, "Accept")) {
    accept = located.req.Accept;
    if (accept !== "application/json" && accept !== "application/octet-stream") fail("Accept must be application/json or application/octet-stream");
  }
  return browserbaseRequest(`/v1/downloads/${encodeURIComponent(located.id)}`, "GET", undefined, { accept, raw: accept === "application/octet-stream" });
}
