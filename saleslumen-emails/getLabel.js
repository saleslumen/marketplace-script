/**
 * @description Get one label.
 * @param {Object} input
 * @param {string} input.id Label id.
 * @returns {Object} Label.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function getLabel(input) {
  return Emails.getLabel(input);
}
