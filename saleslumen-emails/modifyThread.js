/**
 * @description Modify labels on a thread.
 * @param {Object} input
 * @param {string} input.id Thread id.
 * @param {Object} input.body Modify request.
 * @param {string[]} [input.body.addLabelIds] Labels to add.
 * @param {string[]} [input.body.removeLabelIds] Labels to remove.
 * @param {string} [input.body.requestId] Idempotency identity. Required when adding TRASH.
 * @param {number} [input.body.etag] Current thread etag. Required when adding TRASH.
 * @returns {Object} Updated thread.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function modifyThread(input) {
  return Emails.modifyThread(input);
}
