/**
 * @description Get project usage. GET /v1/projects/{id}/usage.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} browserMinutes and proxyBytes
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function getProjectUsage(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/projects/${encodeURIComponent(located.id)}/usage`, "GET");
}
