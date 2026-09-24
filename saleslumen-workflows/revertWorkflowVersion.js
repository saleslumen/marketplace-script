/**
 * @description Copy a published version into a new draft.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {number} input.version Numeric version number, not the version UUID.
 * @param {Object} input.body Empty object.
 * @returns {Object} Workflow.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function revertWorkflowVersion(input) {
  return Workflows.revertWorkflowVersion(input);
}
