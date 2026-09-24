/**
 * @description Append a draft workflow version.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {Object} input.body Request body.
 * @param {string} [input.body.name] Workflow name.
 * @param {Object[]} input.body.nodes Full node list.
 * @param {Object[]} input.body.connections Full edge list.
 * @returns {Object} Workflow.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function updateWorkflow(input) {
  return Workflows.updateWorkflow(input);
}
