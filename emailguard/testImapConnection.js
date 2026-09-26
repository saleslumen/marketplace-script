/**
 * @description Test IMAP Connection. POST /api/v1/email-accounts/test-imap-connection.
 * @param {Object} input
 * @param {string} input.imap_username
 * @param {string} input.imap_password
 * @param {string} input.imap_host
 * @param {string} input.imap_port
 * @param {string} [input.imap_tls]
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: imap_username is required when imap_username is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: imap_password is required when imap_password is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: imap_host is required when imap_host is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: imap_port is required when imap_port is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function testImapConnection(input) {
  const req = inputObject(input);
  const body = {};
  body.imap_username = requireText(req, "imap_username");
  body.imap_password = requireText(req, "imap_password");
  body.imap_host = requireText(req, "imap_host");
  body.imap_port = requireText(req, "imap_port");
  const imap_tls = optionalText(req, "imap_tls");
  if (imap_tls !== undefined) body.imap_tls = imap_tls;
  return emailguardRequest("/api/v1/email-accounts/test-imap-connection", "POST", body);
}
