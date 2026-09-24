/**
 * @description Delete a campaign schedule that no campaign references.
 * @param {Object} input
 * @param {string} input.schedule_id Schedule id.
 * @param {string} input.request_id Idempotency request id.
 * @param {string} input.etag Current etag.
 * @returns {null} Deleted.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function deleteCampaignSchedule(input) {
  return Campaigns.deleteCampaignSchedule(input);
}
