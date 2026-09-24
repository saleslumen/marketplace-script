/**
 * @description Preview a sequence variant.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.sequence_id Sequence id.
 * @param {Object} input.body Requires variant_id and exactly one of person_id or sample_variables.
 * @param {string} input.body.variant_id Variant id.
 * @param {string} [input.body.person_id] Person id.
 * @param {Object} [input.body.sample_variables] Sample variable values.
 * @returns {Object} Preview.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function previewSequence(input) {
  return Campaigns.previewSequence(input);
}
