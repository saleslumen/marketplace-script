/**
 * @description Enqueue a people script run.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {Object} input.body Exactly one of custom_script or installed_app.
 * @param {Object} [input.body.custom_script] Custom script target with script_id, function_name, and optional parameter_names.
 * @param {Object} [input.body.installed_app] Installed app target with installation_id and operation.
 * @returns {Object} Task.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function runCampaignPeopleScript(input) {
  return Campaigns.runCampaignPeopleScript(input);
}
