/**
 * @description Start a workflow execution.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {Object} input.body Request body.
 * @param {Object} [input.body.input] Initial variables.
 * @param {string} [input.body.versionId] Version UUID. Default is the published pin.
 * @returns {Object} Execution.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function startExecution(input) {
  return Workflows.startExecution(input);
}
