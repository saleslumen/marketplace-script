/**
 * @description Replace campaign sender account membership.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {Object} input.body Request body.
 * @param {string[]} input.body.account_ids Opaque account ids.
 * @param {string} input.body.etag Current campaign etag.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Sender account ids and etag.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function setCampaignSenderAccounts(input) {
  return Campaigns.setCampaignSenderAccounts(input);
}
