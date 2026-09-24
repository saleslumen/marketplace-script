/**
 * @description Get one campaign schedule.
 * @param {Object} input
 * @param {string} input.schedule_id Schedule id.
 * @returns {Object} Schedule.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function getCampaignSchedule(input) {
  return Campaigns.getCampaignSchedule(input);
}
