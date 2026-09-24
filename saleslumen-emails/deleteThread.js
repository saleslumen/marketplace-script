/**
 * @description Permanently delete a thread.
 * @param {Object} input
 * @param {string} input.id Thread id.
 * @param {string} input.requestId Idempotency identity.
 * @param {number} input.etag Current thread etag.
 * @returns {null} Empty body.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function deleteThread(input) {
  return Emails.deleteThread(input);
}
