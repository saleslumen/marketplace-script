/**
 * @description Get one delivery.
 * @param {Object} input
 * @param {string} input.delivery_id Delivery id.
 * @returns {Object} Delivery.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function getDelivery(input) {
  return Campaigns.getDelivery(input);
}
