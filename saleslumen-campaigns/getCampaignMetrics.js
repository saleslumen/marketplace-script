/**
 * @description Get campaign metrics.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {string} input.time_range_start Time range start.
 * @param {string} input.time_range_end Time range end.
 * @param {string} input.reporting_timezone IANA timezone.
 * @param {string} [input.step_id] Step id.
 * @param {string} [input.variant_id] Variant id.
 * @param {string} [input.sender_account_id] Sender account id.
 * @returns {Object} Campaign metrics.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function getCampaignMetrics(input) {
  return Campaigns.getCampaignMetrics(input);
}
