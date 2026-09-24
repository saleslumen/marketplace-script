/**
 * @description Update a workflow trigger.
 * @param {Object} input
 * @param {string} input.workflowId Workflow id.
 * @param {string} input.triggerId Trigger id.
 * @param {string} input.updateMask Comma-separated field paths. Allowed: enabled, schedule.cron, schedule.timezone, event.eventType.
 * @param {Object} input.body Trigger fields named in updateMask.
 * @param {boolean} [input.body.enabled] Whether the trigger is enabled.
 * @param {Object} [input.body.schedule] Schedule cron and timezone.
 * @param {string} [input.body.schedule.cron] Cron expression.
 * @param {string} [input.body.schedule.timezone] Timezone.
 * @param {Object} [input.body.event] Event config.
 * @param {string} [input.body.event.eventType] Event type.
 * @returns {Object} Trigger.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function updateWorkflowTrigger(input) {
  return Workflows.updateWorkflowTrigger(input);
}
