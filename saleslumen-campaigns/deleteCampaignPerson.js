/**
 * @description Delete a campaign person with no execution history.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.person_id Person id.
 * @param {string} input.request_id Idempotency request id.
 * @param {string} input.etag Campaign etag.
 * @returns {null} Deleted.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function deleteCampaignPerson(input) {
  return Campaigns.deleteCampaignPerson(input);
}
