/**
 * @description Restore a message from trash.
 * @param {Object} input
 * @param {string} input.id Message id.
 * @returns {Object} Updated message.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function untrashMessage(input) {
  return Emails.untrashMessage(input);
}
