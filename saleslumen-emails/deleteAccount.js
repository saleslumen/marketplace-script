/**
 * @description Delete an email account.
 * @param {Object} input
 * @param {string} input.account_id Account id.
 * @returns {Object} Deleted account response.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function deleteAccount(input) {
  return Emails.deleteAccount(input);
}
