/**
 * @description List messages.
 * @param {Object} [input]
 * @param {number} [input.maxResults] Page size.
 * @param {string} [input.pageToken] Continuation token.
 * @param {string} [input.q] Search query.
 * @param {string[]} [input.labelIds] Label ids the message must include.
 * @param {boolean} [input.includeSpamTrash] Include spam and trash.
 * @param {string[]} [input.accountIds] Account ids. Empty means all accessible accounts.
 * @returns {Object} Message list.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function listMessages(input) {
  return Emails.listMessages(input);
}
