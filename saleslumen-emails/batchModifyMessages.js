/**
 * @description Modify labels on messages.
 * @param {Object} input
 * @param {Object} input.body Batch modify request.
 * @param {string[]} [input.body.ids] Message ids.
 * @param {string[]} [input.body.addLabelIds] Labels to add.
 * @param {string[]} [input.body.removeLabelIds] Labels to remove.
 * @returns {null} Empty body.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function batchModifyMessages(input) {
  return Emails.batchModifyMessages(input);
}
