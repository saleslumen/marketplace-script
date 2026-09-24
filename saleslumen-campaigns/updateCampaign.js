/**
 * @description Patch a campaign with an update mask and etag.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {Object} input.body Request body.
 * @param {Object} input.body.campaign Campaign resource.
 * @param {string} input.body.update_mask Comma-separated field paths.
 * @param {string} input.body.etag Current campaign etag.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Updated campaign.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function updateCampaign(input) {
  return Campaigns.updateCampaign(input);
}
