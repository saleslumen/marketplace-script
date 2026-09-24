/**
 * @description Get one workflow.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @returns {Object} Workflow.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function getWorkflow(input) {
  return Workflows.getWorkflow(input);
}
