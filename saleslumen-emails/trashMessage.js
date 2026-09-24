/**
 * @description Move a message to trash.
 * @param {Object} input
 * @param {string} input.id Message id.
 * @param {string} input.requestId Idempotency identity.
 * @param {number} input.etag Current message etag.
 * @returns {Object} Updated message.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function trashMessage(input) {
  return Emails.trashMessage(input);
}
