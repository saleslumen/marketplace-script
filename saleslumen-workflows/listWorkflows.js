/**
 * @description List workflows.
 * @param {Object} [input]
 * @param {number} [input.pageSize] Number of results per page. Default 50.
 * @param {string} [input.pageToken] Pagination offset as a decimal string. Default "0".
 * @param {string} [input.filter] Reserved. Has no effect.
 * @returns {Object} Workflow page.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function listWorkflows(input) {
  return Workflows.listWorkflows(input);
}
