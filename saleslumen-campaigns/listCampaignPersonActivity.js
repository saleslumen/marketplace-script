/**
 * @description List person activity in chronological order.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.person_id Person id.
 * @param {number} [input.page_size] Bounded page size. Default 50, maximum 200.
 * @param {string} [input.page_token] Opaque page token.
 * @returns {Object} Activity page.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function listCampaignPersonActivity(input) {
  return Campaigns.listCampaignPersonActivity(input);
}
