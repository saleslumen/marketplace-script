/**
 * @description Get a sequence tree.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.sequence_id Sequence id.
 * @returns {Object} Sequence.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function getSequence(input) {
  return Campaigns.getSequence(input);
}
