/**
 * @description Create a draft.
 * @param {Object} input
 * @param {Object} input.body Create request.
 * @param {Object} input.body.draft Draft to create.
 * @param {string} [input.body.draft.id] Draft id.
 * @param {Object} [input.body.draft.message] Draft message.
 * @returns {Object} Created draft.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function createDraft(input) {
  return Emails.createDraft(input);
}
