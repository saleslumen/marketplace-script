/**
 * @description Return a campaign regardless of archive visibility.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @returns {Object} Campaign.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function getCampaign(input) {
  return Campaigns.getCampaign(input);
}
