/**
 * @description Resume a paused execution.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {string} input.executionId Execution id.
 * @param {Object} input.body Request body.
 * @param {Object} [input.body.input] Additional variables merged in on resume.
 * @returns {Object} Execution.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function resumeExecution(input) {
  return Workflows.resumeExecution(input);
}
