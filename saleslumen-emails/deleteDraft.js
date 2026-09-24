/**
 * @description Permanently delete a draft.
 * @param {Object} input
 * @param {string} input.id Draft id.
 * @param {string} input.requestId Idempotency identity.
 * @param {number} input.etag Current draft message etag.
 * @returns {null} Empty body.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function deleteDraft(input) {
  return Emails.deleteDraft(input);
}
