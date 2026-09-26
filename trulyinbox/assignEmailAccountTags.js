/**
 * @description Assign tags to email accounts.
 * @param {Object} input
 * @param {number[]} input.emailAccountIds
 * @param {string[]} input.tags
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function assignEmailAccountTags(input) {
  const req = requireObjectInput(input);
  const body = {
    emailAccountIds: readRequired(req, "emailAccountIds", "emailAccountIds", "array"),
    tags: readRequired(req, "tags", "tags", "array"),
  };
  return trulyinboxRequest("POST", "/email-accounts/tags/assign", body);
}
