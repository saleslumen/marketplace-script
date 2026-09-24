/**
 * @description Create a draft campaign and its automatic main sequence.
 * @param {Object} input
 * @param {Object} input.body Request body.
 * @param {string} input.body.display_name Display name.
 * @param {string} input.body.organization Organization.
 * @param {string} [input.body.namespace] Namespace.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Created campaign and main sequence.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function createCampaign(input) {
  return Campaigns.createCampaign(input);
}
