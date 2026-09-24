/**
 * @description Delete an unused triggered sequence.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.sequence_id Sequence id.
 * @param {string} input.request_id Idempotency request id.
 * @param {string} input.etag Current etag.
 * @returns {null} Deleted.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function deleteSequence(input) {
  return Campaigns.deleteSequence(input);
}
