/**
 * @description Permanently delete a message.
 * @param {Object} input
 * @param {string} input.id Message id.
 * @param {string} input.requestId Idempotency identity.
 * @param {number} input.etag Current message etag.
 * @returns {null} Empty body.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function deleteMessage(input) {
  return Emails.deleteMessage(input);
}
