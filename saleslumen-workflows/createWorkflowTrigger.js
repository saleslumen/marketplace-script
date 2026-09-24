/**
 * @description Create a workflow trigger.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {Object} input.body Trigger resource. Exactly one of webhook, schedule, or event.
 * @param {boolean} [input.body.enabled] Whether the trigger is enabled. Omitted or false creates a disabled trigger.
 * @param {Object} [input.body.webhook] Empty object for a webhook trigger.
 * @param {Object} [input.body.schedule] Schedule config with cron and timezone.
 * @param {Object} [input.body.event] Event config with eventType.
 * @returns {Object} Trigger.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function createWorkflowTrigger(input) {
  return Workflows.createWorkflowTrigger(input);
}
