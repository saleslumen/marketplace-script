/**
 * @description Get one execution.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {string} input.executionId Execution id.
 * @returns {Object} Execution.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function getExecution(input) {
  return Workflows.getExecution(input);
}
