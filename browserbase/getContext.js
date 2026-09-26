/**
 * @description Get a context. GET /v1/contexts/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} the Browserbase context
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function getContext(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/contexts/${encodeURIComponent(located.id)}`, "GET");
}
