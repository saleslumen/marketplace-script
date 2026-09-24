/**
 * @description Move a thread to trash.
 * @param {Object} input
 * @param {string} input.id Thread id.
 * @param {string} input.requestId Idempotency identity.
 * @param {number} input.etag Current thread etag.
 * @returns {Object} Updated thread.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function trashThread(input) {
  return Emails.trashThread(input);
}
