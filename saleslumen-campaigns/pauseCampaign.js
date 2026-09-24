/**
 * @description Pause a campaign and return a long-running operation.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {Object} input.body Request body.
 * @param {string} input.body.etag Current campaign etag.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Operation.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function pauseCampaign(input) {
  return Campaigns.pauseCampaign(input);
}
