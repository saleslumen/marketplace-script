/**
 * @description Get one campaign task.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.task_id Task id.
 * @returns {Object} Task.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function getCampaignTask(input) {
  return Campaigns.getCampaignTask(input);
}
