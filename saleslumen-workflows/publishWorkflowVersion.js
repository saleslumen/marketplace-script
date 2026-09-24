/**
 * @description Publish the latest draft.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {Object} input.body Empty object.
 * @returns {Object} Workflow.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function publishWorkflowVersion(input) {
  return Workflows.publishWorkflowVersion(input);
}
