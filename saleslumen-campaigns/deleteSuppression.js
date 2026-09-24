/**
 * @description Delete a suppression.
 * @param {Object} input
 * @param {string} input.suppression_id Suppression id.
 * @param {string} input.request_id Idempotency request id.
 * @param {string} input.etag Current etag.
 * @returns {null} Deleted.
 * @throws {Error} The Campaigns service returned status 400 or higher.
 */
async function deleteSuppression(input) {
  return Campaigns.deleteSuppression(input);
}
