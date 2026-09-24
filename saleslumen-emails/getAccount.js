/**
 * @description Get one email account.
 * @param {Object} input
 * @param {string} input.account_id Account id.
 * @returns {Object} Account.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function getAccount(input) {
  return Emails.getAccount(input);
}
