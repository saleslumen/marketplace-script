/**
 * @description Get one workflow trigger.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {string} input.triggerId Trigger id.
 * @returns {Object} Trigger.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function getWorkflowTrigger(input) {
  return Workflows.getWorkflowTrigger(input);
}
