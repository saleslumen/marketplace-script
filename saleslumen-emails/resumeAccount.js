/**
 * @description Resume one email account.
 * @param {Object} input
 * @param {string} input.account_id Account id.
 * @param {Object} input.body Empty object.
 * @returns {Object} Resumed account.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function resumeAccount(input) {
  return Emails.resumeAccount(input);
}
