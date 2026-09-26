/**
 * @description Delete an extension. DELETE /v1/extensions/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @returns {null} when Browserbase returns an empty body
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function deleteExtension(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/extensions/${encodeURIComponent(located.id)}`, "DELETE");
}
