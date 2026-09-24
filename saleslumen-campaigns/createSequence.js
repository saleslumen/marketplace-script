/**
 * @description Create a triggered sequence.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {Object} input.body Request body.
 * @param {string} input.body.display_name Display name.
 * @param {Object} input.body.trigger Sequence trigger with event_type, srl_expression, priority, and entry_delay_seconds.
 * @param {Object[]} [input.body.steps] Sequence steps.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Sequence.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function createSequence(input) {
  return Campaigns.createSequence(input);
}
