/**
 * @description Delete Email Account. DELETE /api/v1/email-accounts/delete/{email_account_uuid}.
 * @param {Object} input
 * @param {string} input.email_account_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: email_account_uuid is required when email_account_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function deleteEmailAccount(input) {
  const req = inputObject(input);
  const email_account_uuid = requireText(req, "email_account_uuid");
  return emailguardRequest(`/api/v1/email-accounts/delete/${encodeURIComponent(email_account_uuid)}`, "DELETE");
}
