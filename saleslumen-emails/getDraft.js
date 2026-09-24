/**
 * @description Get one draft.
 * @param {Object} input
 * @param {string} input.id Draft id.
 * @param {string} [input.format] Embedded message format: MINIMAL, METADATA, FULL, or RAW.
 * @returns {Object} Draft.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function getDraft(input) {
  return Emails.getDraft(input);
}
