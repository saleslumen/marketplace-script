/**
 * @description Test SMTP credentials. Never returns the password.
 * @param {Object} input
 * @returns {Object}
 */
async function testSmtpConnection(input) {
  const req = input && typeof input === "object" ? input : {};
  const smtp_username = asString(firstPresent(req, ["smtp_username", "smtpUsername"]));
  if (!smtp_username) return missingInput("smtp_username");
  const smtp_password = asString(firstPresent(req, ["smtp_password", "smtpPassword"]));
  if (!smtp_password) return missingInput("smtp_password");
  const smtp_host = asString(firstPresent(req, ["smtp_host", "smtpHost"]));
  if (!smtp_host) return missingInput("smtp_host");
  const smtp_port = asString(firstPresent(req, ["smtp_port", "smtpPort"]));
  if (!smtp_port) return missingInput("smtp_port");
  const smtp_tls = asString(firstPresent(req, ["smtp_tls", "smtpTls"]));
  if (!smtp_tls) return missingInput("smtp_tls");
  const body = {};
  body.smtp_username = smtp_username;
  body.smtp_password = smtp_password;
  body.smtp_host = smtp_host;
  body.smtp_port = smtp_port;
  body.smtp_tls = smtp_tls;
  return runAuthed("/api/v1/email-accounts/test-smtp-connection", "POST", body, "SMTP_TESTED", "SMTP_TEST_FAILED");
}
