/**
 * @description Get one message attachment.
 * @param {Object} input
 * @param {string} input.messageId Parent message id.
 * @param {string} input.id Attachment id.
 * @returns {Object} Attachment.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function getAttachment(input) {
  return Emails.getAttachment(input);
}
