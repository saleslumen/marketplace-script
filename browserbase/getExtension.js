/**
 * @description Get an extension. GET /v1/extensions/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} the Browserbase extension
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function getExtension(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/extensions/${encodeURIComponent(located.id)}`, "GET");
}
