/**
 * @description Resume a campaign when readiness succeeds.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {Object} input.body Request body.
 * @param {string} input.body.etag Current campaign etag.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Campaign.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function resumeCampaign(input) {
  return Campaigns.resumeCampaign(input);
}
