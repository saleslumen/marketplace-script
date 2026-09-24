/**
 * @description List executions for a workflow.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {number} [input.pageSize] Number of results per page. Default 50.
 * @param {string} [input.pageToken] Pagination offset as a decimal string. Default "0".
 * @param {string} [input.filter] Reserved. Has no effect.
 * @returns {Object} Execution page.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function listExecutions(input) {
  return Workflows.listExecutions(input);
}
