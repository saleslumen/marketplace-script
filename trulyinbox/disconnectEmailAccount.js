/**
 * @description Temporarily disconnect an email account without deleting it.
 * @param {Object} input
 * @param {number} input.emailAccountId
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function disconnectEmailAccount(input) {
  const req = requireObjectInput(input);
  const emailAccountId = readRequired(req, "emailAccountId", "emailAccountId", "number");
  return trulyinboxRequest("POST", `/email-accounts/${encodeURIComponent(emailAccountId)}/disconnect`);
}
