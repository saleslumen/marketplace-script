/**
 * @description Unsubscribe one campaign person.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.person_id Person id.
 * @param {Object} input.body Request body.
 * @param {string} input.body.etag Current etag.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Operation.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function unsubscribeCampaignPerson(input) {
  return Campaigns.unsubscribeCampaignPerson(input);
}
