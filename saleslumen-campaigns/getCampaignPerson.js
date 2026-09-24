/**
 * @description Get one campaign person.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.person_id Person id.
 * @returns {Object} Person.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function getCampaignPerson(input) {
  return Campaigns.getCampaignPerson(input);
}
