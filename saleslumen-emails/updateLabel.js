/**
 * @description Rename a user label.
 * @param {Object} input
 * @param {string} input.label.id User label id.
 * @param {string} [input.updateMask] Fields to update. Only name is accepted.
 * @param {Object} input.body Label fields.
 * @param {string} input.body.name Display name.
 * @param {number} input.body.etag Current label etag.
 * @returns {Object} Updated label.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function updateLabel(input) {
  return Emails.updateLabel(input);
}
