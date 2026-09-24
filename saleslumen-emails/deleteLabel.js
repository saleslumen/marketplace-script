/**
 * @description Delete a user label.
 * @param {Object} input
 * @param {string} input.id Label id.
 * @returns {null} Empty body.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function deleteLabel(input) {
  return Emails.deleteLabel(input);
}
