/**
 * @description Send a draft.
 * @param {Object} input
 * @param {Object} input.body Send request.
 * @param {Object} input.body.draft Draft to send.
 * @param {string} input.body.draft.id Draft id.
 * @param {Object} [input.body.draft.message] Message fields.
 * @param {string} [input.body.draft.message.scheduleTime] Epoch milliseconds. Omit to send immediately.
 * @param {string} input.body.requestId Idempotency identity.
 * @returns {Object} Sent message.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function sendDraft(input) {
  return Emails.sendDraft(input);
}
