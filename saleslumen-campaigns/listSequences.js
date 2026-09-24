/**
 * @description List sequences in a campaign.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {number} [input.page_size] Bounded page size. Default 50, maximum 200.
 * @param {string} [input.page_token] Opaque page token.
 * @returns {Object} Sequence page.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function listSequences(input) {
  return Campaigns.listSequences(input);
}
