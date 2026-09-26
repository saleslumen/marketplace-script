/**
 * @description Connect an email account with SMTP and IMAP credentials.
 * @param {Object} input
 * @param {string} [input.fromName]
 * @param {string} input.emailServiceProvider
 * @param {Object} input.smtp
 * @param {string} input.smtp.emailAddress
 * @param {string} input.smtp.host
 * @param {number} input.smtp.port
 * @param {string} input.smtp.password
 * @param {boolean} input.smtp.encryption
 * @param {string} [input.smtp.userName]
 * @param {Object} input.imap
 * @param {string} [input.imap.emailAddress]
 * @param {string} input.imap.host
 * @param {number} input.imap.port
 * @param {string} input.imap.password
 * @param {boolean} input.imap.encryption
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function connectSmtpImapAccount(input) {
  const req = requireObjectInput(input);
  const smtpIn = readRequired(req, "smtp", "smtp", "object");
  const imapIn = readRequired(req, "imap", "imap", "object");
  const smtp = {
    emailAddress: readRequired(smtpIn, "emailAddress", "smtp.emailAddress", "string"),
    host: readRequired(smtpIn, "host", "smtp.host", "string"),
    port: readRequired(smtpIn, "port", "smtp.port", "number"),
    password: readRequired(smtpIn, "password", "smtp.password", "string"),
    encryption: readRequired(smtpIn, "encryption", "smtp.encryption", "boolean"),
  };
  if (smtpIn.userName !== undefined) smtp.userName = smtpIn.userName;
  const imap = {
    host: readRequired(imapIn, "host", "imap.host", "string"),
    port: readRequired(imapIn, "port", "imap.port", "number"),
    password: readRequired(imapIn, "password", "imap.password", "string"),
    encryption: readRequired(imapIn, "encryption", "imap.encryption", "boolean"),
  };
  if (imapIn.emailAddress !== undefined) imap.emailAddress = imapIn.emailAddress;
  const body = {
    emailServiceProvider: readRequired(req, "emailServiceProvider", "emailServiceProvider", "string"),
    smtp,
    imap,
  };
  if (req.fromName !== undefined) body.fromName = req.fromName;
  return trulyinboxRequest("POST", "/email-accounts", body);
}
