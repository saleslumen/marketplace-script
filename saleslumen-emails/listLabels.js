/**
 * @description List labels.
 * @param {Object} [input]
 * @returns {Object} Label list.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function listLabels(input) {
  return Emails.listLabels(input);
}
