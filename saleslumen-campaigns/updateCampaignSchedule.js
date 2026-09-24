/**
 * @description Patch a campaign schedule.
 * @param {Object} input
 * @param {string} input.schedule_id Schedule id.
 * @param {Object} input.body Request body.
 * @param {Object} input.body.schedule Campaign schedule.
 * @param {string} input.body.update_mask Field mask.
 * @param {string} input.body.etag Current etag.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Schedule.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function updateCampaignSchedule(input) {
  return Campaigns.updateCampaignSchedule(input);
}
