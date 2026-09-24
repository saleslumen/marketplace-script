/**
 * @description Rotate a webhook token.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {string} input.triggerId Trigger id.
 * @param {Object} input.body Empty object.
 * @returns {Object} Trigger and webhook credential.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function rotateWorkflowTriggerWebhookToken(input) {
  return Workflows.rotateWorkflowTriggerWebhookToken(input);
}
