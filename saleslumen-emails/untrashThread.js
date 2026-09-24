/**
 * @description Restore a thread from trash.
 * @param {Object} input
 * @param {string} input.id Thread id.
 * @returns {Object} Updated thread.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function untrashThread(input) {
  return Emails.untrashThread(input);
}
