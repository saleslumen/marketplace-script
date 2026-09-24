/**
 * @description List drafts.
 * @param {Object} [input]
 * @param {number} [input.maxResults] Page size.
 * @param {string} [input.pageToken] Continuation token.
 * @param {string} [input.q] Search query.
 * @param {boolean} [input.includeSpamTrash] Include spam and trash.
 * @returns {Object} Draft list.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function listDrafts(input) {
  return Emails.listDrafts(input);
}
