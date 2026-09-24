/**
 * @description Create a user label.
 * @param {Object} input
 * @param {Object} input.body Create request.
 * @param {Object} input.body.label Label to create.
 * @param {string} input.body.label.name Display name.
 * @returns {Object} Created label.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function createLabel(input) {
  return Emails.createLabel(input);
}
