/**
 * @description Create an unpublished draft workflow.
 * @param {Object} input
 * @param {Object} input.body Request body.
 * @param {string} input.body.name Workflow name.
 * @param {Object[]} input.body.nodes Full node list.
 * @param {Object[]} input.body.connections Full edge list.
 * @returns {Object} Workflow.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function createWorkflow(input) {
  return Workflows.createWorkflow(input);
}
