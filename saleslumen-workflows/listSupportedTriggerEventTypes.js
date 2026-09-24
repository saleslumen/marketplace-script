/**
 * @description List supported trigger event types.
 * @param {Object} [input]
 * @returns {Object} Trigger event types.
 * @throws {Error} The Workflows service returned status 400 or higher.
 */
async function listSupportedTriggerEventTypes(input) {
  return Workflows.listSupportedTriggerEventTypes(input);
}
