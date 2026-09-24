/**
 * @description List threads.
 * @param {Object} [input]
 * @param {number} [input.maxResults] Page size.
 * @param {string} [input.pageToken] Continuation token.
 * @param {string} [input.q] Search query.
 * @param {string[]} [input.labelIds] Label ids the thread must include.
 * @param {boolean} [input.includeSpamTrash] Include spam and trash.
 * @param {string[]} [input.accountIds] Account ids. Empty means all accessible accounts.
 * @returns {Object} Thread list.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function listThreads(input) {
  return Emails.listThreads(input);
}
