/**
 * @description Get one thread.
 * @param {Object} input
 * @param {string} input.id Thread id.
 * @param {string} [input.format] Embedded message format: MINIMAL, METADATA, FULL, or RAW.
 * @param {string[]} [input.metadataHeaders] Headers to return when format is METADATA.
 * @returns {Object} Thread.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function getThread(input) {
  return Emails.getThread(input);
}
