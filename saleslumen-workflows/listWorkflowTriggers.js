/**
 * @description List workflow triggers.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {number} [input.pageSize] Results per page. Default 50, maximum 100.
 * @param {string} [input.pageToken] Pagination offset as a decimal string. Default "0".
 * @returns {Object} Trigger page.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function listWorkflowTriggers(input) {
  return Workflows.listWorkflowTriggers(input);
}
