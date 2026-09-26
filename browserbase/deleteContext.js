/**
 * @description Delete a context. DELETE /v1/contexts/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @returns {null} when Browserbase returns an empty body
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function deleteContext(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/contexts/${encodeURIComponent(located.id)}`, "DELETE");
}
