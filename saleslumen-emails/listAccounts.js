/**
 * @description List email accounts.
 * @param {Object} [input]
 * @param {number} [input.page] Page number.
 * @param {number} [input.limit] Page size.
 * @param {string} [input.email] Email address filter.
 * @returns {Object} Account list.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function listAccounts(input) {
  return Emails.listAccounts(input);
}
