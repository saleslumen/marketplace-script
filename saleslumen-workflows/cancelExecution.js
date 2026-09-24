/**
 * @description Cancel an active or paused execution.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {string} input.executionId Execution id.
 * @param {Object} input.body Empty object.
 * @returns {Object} Execution.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function cancelExecution(input) {
  return Workflows.cancelExecution(input);
}
