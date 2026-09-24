/**
 * @description Modify message labels or scheduled time.
 * @param {Object} input
 * @param {string} input.id Message id.
 * @param {Object} input.body Modify request.
 * @param {string[]} [input.body.addLabelIds] Labels to add.
 * @param {string[]} [input.body.removeLabelIds] Labels to remove.
 * @param {string} [input.body.scheduleTime] Epoch milliseconds. Reschedules or unschedules an existing send.
 * @param {string} [input.body.requestId] Idempotency identity. Required when scheduleTime changes or TRASH is added.
 * @param {number} [input.body.etag] Current message etag. Required when scheduleTime changes or TRASH is added.
 * @returns {Object} Updated message.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function modifyMessage(input) {
  return Emails.modifyMessage(input);
}
