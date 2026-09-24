/**
 * @description Permanently delete messages.
 * @param {Object} input
 * @param {Object} input.body Batch delete request.
 * @param {string[]} input.body.ids Message ids.
 * @param {string} input.body.requestId Idempotency identity.
 * @param {number[]} input.body.etags Message etags, same length and order as ids.
 * @returns {null} Empty body.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function batchDeleteMessages(input) {
  return Emails.batchDeleteMessages(input);
}
