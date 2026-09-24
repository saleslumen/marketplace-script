/**
 * @description List deliveries in a campaign.
 * @param {Object} input
 * @param {string} input.campaign_id Campaign id.
 * @param {number} [input.page_size] Bounded page size. Default 50, maximum 200.
 * @param {string} [input.page_token] Opaque page token.
 * @param {string} [input.person_id] Person id.
 * @param {string} [input.status] ALLOCATING, PLANNED, SUBMITTING, ACCEPTED, ATTEMPTING, SENT, UNKNOWN, CANCELLED, or FAILED.
 * @param {string} [input.step_id] Step id.
 * @param {string} [input.sender_account_id] Sender account id.
 * @param {string} [input.failure_code] Failure code.
 * @param {string} [input.scheduled_after] Scheduled after.
 * @param {string} [input.scheduled_before] Scheduled before.
 * @returns {Object} Delivery page.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function listCampaignDeliveries(input) {
  return Campaigns.listCampaignDeliveries(input);
}
