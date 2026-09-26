/**
 * @description Create IMAP/SMTP Email Account. POST /api/v1/email-accounts/imap-smtp.
 * @param {Object} input
 * @param {string} input.name
 * @param {number} input.provider
 * @param {string} input.imap_username
 * @param {string} input.imap_password
 * @param {string} input.imap_host
 * @param {string} input.imap_port
 * @param {string} [input.imap_tls]
 * @param {string} input.smtp_username
 * @param {string} input.smtp_password
 * @param {string} input.smtp_host
 * @param {string} input.smtp_port
 * @param {string} input.smtp_tls
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: name is required when name is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: provider is required when provider is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: imap_username is required when imap_username is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: imap_password is required when imap_password is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: imap_host is required when imap_host is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: imap_port is required when imap_port is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: smtp_username is required when smtp_username is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: smtp_password is required when smtp_password is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: smtp_host is required when smtp_host is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: smtp_port is required when smtp_port is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: smtp_tls is required when smtp_tls is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function createImapSmtpEmailAccount(input) {
  const req = inputObject(input);
  const body = {};
  body.name = requireText(req, "name");
  body.provider = requireFiniteNumber(req, "provider");
  body.imap_username = requireText(req, "imap_username");
  body.imap_password = requireText(req, "imap_password");
  body.imap_host = requireText(req, "imap_host");
  body.imap_port = requireText(req, "imap_port");
  const imap_tls = optionalText(req, "imap_tls");
  if (imap_tls !== undefined) body.imap_tls = imap_tls;
  body.smtp_username = requireText(req, "smtp_username");
  body.smtp_password = requireText(req, "smtp_password");
  body.smtp_host = requireText(req, "smtp_host");
  body.smtp_port = requireText(req, "smtp_port");
  body.smtp_tls = requireText(req, "smtp_tls");
  return emailguardRequest("/api/v1/email-accounts/imap-smtp", "POST", body);
}
