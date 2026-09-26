/**
 * @description Permanently delete up to 20 email accounts.
 * @param {Object} input
 * @param {number[]} input.emailAccountIds
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function deleteEmailAccountsBulk(input) {
  const req = requireObjectInput(input);
  const body = { emailAccountIds: readRequired(req, "emailAccountIds", "emailAccountIds", "array") };
  return trulyinboxRequest("POST", "/email-accounts/bulk-delete", body);
}
