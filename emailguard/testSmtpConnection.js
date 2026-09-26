/**
 * @description Test SMTP Connection. POST /api/v1/email-accounts/test-smtp-connection.
 * @param {Object} input
 * @param {string} input.smtp_username
 * @param {string} input.smtp_password
 * @param {string} input.smtp_host
 * @param {string} input.smtp_port
 * @param {string} input.smtp_tls
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: smtp_username is required when smtp_username is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: smtp_password is required when smtp_password is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: smtp_host is required when smtp_host is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: smtp_port is required when smtp_port is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: smtp_tls is required when smtp_tls is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function testSmtpConnection(input) {
  const req = inputObject(input);
  const body = {};
  body.smtp_username = requireText(req, "smtp_username");
  body.smtp_password = requireText(req, "smtp_password");
  body.smtp_host = requireText(req, "smtp_host");
  body.smtp_port = requireText(req, "smtp_port");
  body.smtp_tls = requireText(req, "smtp_tls");
  return emailguardRequest("/api/v1/email-accounts/test-smtp-connection", "POST", body);
}
