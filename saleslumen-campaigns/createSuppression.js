/**
 * @description Create a suppression.
 * @param {Object} input
 * @param {Object} input.body Request body.
 * @param {string} input.body.email_address Email address.
 * @param {string} input.body.reason UNSUBSCRIBED, MANUAL_BLOCK, or HARD_BOUNCE.
 * @param {string} input.body.request_id Idempotency request id.
 * @returns {Object} Suppression.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function createSuppression(input) {
  return Campaigns.createSuppression(input);
}
