/**
 * @description Delete a batch of campaign people.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {Object} input.body Request body.
 * @param {string[]} input.body.person_ids Person ids.
 * @param {string} input.body.etag Campaign etag.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Empty result.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function batchDeleteCampaignPeople(input) {
  return Campaigns.batchDeleteCampaignPeople(input);
}
