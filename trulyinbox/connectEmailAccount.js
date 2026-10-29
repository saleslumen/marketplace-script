/**
 * @description Connect an SMTP/IMAP email account.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {string} input.emailAddress
 * @param {string} [input.senderName]
 * @param {string} input.smtpHost
 * @param {number} input.smtpPort
 * @param {string} input.smtpEncryption
 * @param {string} input.imapHost
 * @param {number} input.imapPort
 * @param {string} input.imapEncryption
 * @param {string} input.smtpUsername
 * @param {string} [input.imapUsername]
 * @param {string} input.password
 * @param {string} [input.imapPassword]
 * @param {string} [input.espPresetId]
 * @param {string} [input.displayName]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function connectEmailAccount(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const body = {
    emailAddress: readRequired(req, "emailAddress", "emailAddress", "string"),
    smtpHost: readRequired(req, "smtpHost", "smtpHost", "string"),
    smtpPort: readRequired(req, "smtpPort", "smtpPort", "number"),
    smtpEncryption: readRequired(req, "smtpEncryption", "smtpEncryption", "string"),
    imapHost: readRequired(req, "imapHost", "imapHost", "string"),
    imapPort: readRequired(req, "imapPort", "imapPort", "number"),
    imapEncryption: readRequired(req, "imapEncryption", "imapEncryption", "string"),
    smtpUsername: readRequired(req, "smtpUsername", "smtpUsername", "string"),
    password: readRequired(req, "password", "password", "string"),
  };
  put(body, "senderName", readOptional(req, "senderName", "string"));
  put(body, "imapUsername", readOptional(req, "imapUsername", "string"));
  put(body, "imapPassword", readOptional(req, "imapPassword", "string"));
  put(body, "espPresetId", readOptional(req, "espPresetId", "string"));
  put(body, "displayName", readOptional(req, "displayName", "string"));
  return trulyinboxRequest("POST", workspacePath(workspaceId, "/accounts"), body);
}
