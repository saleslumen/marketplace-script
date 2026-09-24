/**
 * @description Patch person variables.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.person_id Person id.
 * @param {Object} input.body Request body.
 * @param {Object} input.body.person Campaign person.
 * @param {string} input.body.update_mask Field mask.
 * @param {string} input.body.etag Current etag.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Person.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function updateCampaignPerson(input) {
  return Campaigns.updateCampaignPerson(input);
}
