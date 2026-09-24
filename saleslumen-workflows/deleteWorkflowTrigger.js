/**
 * @description Delete a workflow trigger.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {string} input.triggerId Trigger id.
 * @returns {null} Deleted.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function deleteWorkflowTrigger(input) {
  return Workflows.deleteWorkflowTrigger(input);
}
