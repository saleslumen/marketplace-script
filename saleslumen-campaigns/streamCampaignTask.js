/**
 * @description Stream task progress as server-sent events.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.task_id Task id.
 * @returns {string} Server-sent task events.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function streamCampaignTask(input) {
  return Campaigns.streamCampaignTask(input);
}
