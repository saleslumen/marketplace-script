/**
 * @description List all versions of a workflow.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @returns {Object} Version list.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function getWorkflowHistory(input) {
  return Workflows.getWorkflowHistory(input);
}
