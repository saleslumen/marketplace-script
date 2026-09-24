/**
 * @description Resolve an unknown send as sent or retry.
 * @param {Object} input
 * @param {string} input.delivery_id Delivery id.
 * @param {Object} input.body Request body.
 * @param {string} input.body.request_id Idempotency request id.
 * @param {string} input.body.outcome SENT or RETRY.
 * @returns {Object} Delivery.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function resolveUnknownDelivery(input) {
  return Campaigns.resolveUnknownDelivery(input);
}
