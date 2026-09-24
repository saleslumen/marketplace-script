/**
 * @description Get one workflow version.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {number} input.version Numeric version number.
 * @returns {Object} Workflow version.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function getWorkflowVersion(input) {
  return Workflows.getWorkflowVersion(input);
}
