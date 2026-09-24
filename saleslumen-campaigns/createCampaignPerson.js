/**
 * @description Create one campaign person.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {Object} input.body Request body.
 * @param {string} [input.body.email_address] Email address.
 * @param {Object} input.body.variables Person variables.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Person.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function createCampaignPerson(input) {
  return Campaigns.createCampaignPerson(input);
}
