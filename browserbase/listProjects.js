/**
 * @description List projects. GET /v1/projects.
 * @returns {Object[]} projects
 * @throws {Error} BROWSERBASE_REQUEST_FAILED when Browserbase rejects the request
 */
async function listProjects() {
  return browserbaseRequest("/v1/projects", "GET");
}
