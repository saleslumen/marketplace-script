/**
 * @description List campaign schedules.
 * @param {Object} [input]
 * @param {number} [input.page_size] Bounded page size. Default 50, maximum 200.
 * @param {string} [input.page_token] Opaque page token.
 * @returns {Object} Schedule page.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function listCampaignSchedules(input) {
  return Campaigns.listCampaignSchedules(input);
}
