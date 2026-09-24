/**
 * @description Enqueue a people import.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {Object} input.body Exactly one of rows or csv, with request_id.
 * @param {string} input.body.request_id Idempotency request id.
 * @param {Object[]} [input.body.rows] Person rows with email_address and variables.
 * @param {string} [input.body.csv] CSV body.
 * @returns {Object} Task.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function importCampaignPeople(input) {
  return Campaigns.importCampaignPeople(input);
}
