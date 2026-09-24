/**
 * @description Generate quoted content for a reply or forward.
 * @param {Object} input
 * @param {Object} input.body Quote request.
 * @param {string} input.body.replyToMessageId Message to quote.
 * @param {string} input.body.quoteType Quote type: reply or forward.
 * @param {string} [input.body.userBody] Content prepended before the quote.
 * @returns {Object} Quoted content.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function generateQuotedContent(input) {
  return Emails.generateQuotedContent(input);
}
