/**
 * @description Get one message.
 * @param {Object} input
 * @param {string} input.id Message id.
 * @param {string} [input.format] Message format: MINIMAL, METADATA, FULL, or RAW.
 * @param {string[]} [input.metadataHeaders] Headers to return when format is METADATA.
 * @returns {Object} Message.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function getMessage(input) {
  return Emails.getMessage(input);
}
