/**
 * @description Replace a draft.
 * @param {Object} input
 * @param {string} input.id Draft id.
 * @param {Object} input.body Update request.
 * @param {Object} input.body.draft Replacement draft.
 * @param {string} [input.body.draft.id] Draft id.
 * @param {Object} [input.body.draft.message] Draft message.
 * @returns {Object} Updated draft.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function updateDraft(input) {
  return Emails.updateDraft(input);
}
