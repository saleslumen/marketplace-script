/**
 * @description Get a project. GET /v1/projects/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} the Browserbase project
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when id is missing or Browserbase rejects the request
 */
async function getProject(input) {
  const located = requirePathId(input);
  return browserbaseRequest(`/v1/projects/${encodeURIComponent(located.id)}`, "GET");
}
