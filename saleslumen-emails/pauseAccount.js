/**
 * @description Pause one email account.
 * @param {Object} input
 * @param {string} input.account_id Account id.
 * @param {Object} input.body Empty object.
 * @returns {Object} Paused account.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function pauseAccount(input) {
  return Emails.pauseAccount(input);
}
