/**
 * @description Refresh OAuth tokens.
 * @param {Object} input
 * @param {Object} input.body Refresh request.
 * @param {string} input.body.account_id Account id.
 * @param {string} input.body.request_id Idempotency key.
 * @returns {Object} Refresh result.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function refreshToken(input) {
  return Emails.refreshToken(input);
}
