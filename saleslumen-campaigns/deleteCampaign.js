/**
 * @description Hard-delete a draft campaign.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.request_id Idempotency request id.
 * @param {string} input.etag Current campaign etag.
 * @returns {null} Deleted.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function deleteCampaign(input) {
  return Campaigns.deleteCampaign(input);
}
