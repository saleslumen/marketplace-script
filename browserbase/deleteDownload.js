/**
 * @description Delete a download. DELETE /v1/downloads/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @returns {null} when Browserbase returns an empty body
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function deleteDownload(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/downloads/${encodeURIComponent(located.id)}`, "DELETE");
}
