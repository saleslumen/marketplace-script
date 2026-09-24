/**
 * @description Replace a sequence tree.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.sequence_id Sequence id.
 * @param {Object} input.body Request body.
 * @param {Object} input.body.sequence Sequence tree.
 * @param {string} input.body.update_mask Field mask. Full-tree replace uses * or trigger and steps paths.
 * @param {string} input.body.etag Current etag.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Sequence.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function updateSequence(input) {
  return Campaigns.updateSequence(input);
}
