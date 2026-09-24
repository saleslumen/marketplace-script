/**
 * @description Replace the ordered campaign variable list.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {Object} input.body Request body.
 * @param {string[]} input.body.variables Ordered variable names.
 * @param {string} input.body.etag Current campaign etag.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Campaign.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function setCampaignVariables(input) {
  return Campaigns.setCampaignVariables(input);
}
