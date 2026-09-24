/**
 * @description Create a reusable campaign schedule.
 * @param {Object} input
 * @param {Object} input.body Request body.
 * @param {string} input.body.display_name Display name.
 * @param {string} input.body.timezone Timezone.
 * @param {string[]} input.body.days ISO days: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, or SUNDAY.
 * @param {string} input.body.start_time HH:MM:SS local wall time with no offset.
 * @param {string} input.body.end_time HH:MM:SS local wall time with no offset.
 * @param {number} input.body.minimum_spacing_seconds Minimum spacing in seconds.
 * @param {string} input.body.organization Organization.
 * @param {string} [input.body.namespace] Namespace.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Schedule.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function createCampaignSchedule(input) {
  return Campaigns.createCampaignSchedule(input);
}
