/**
 * @description Delete a workflow.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @returns {null} Deleted.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function deleteWorkflow(input) {
  return Workflows.deleteWorkflow(input);
}
