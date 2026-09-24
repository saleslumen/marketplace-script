/**
 * @description Test IMAP credentials. Never returns the password.
 * @param {Object} input
 * @returns {Object}
 */
async function testImapConnection(input) {
  const req = input && typeof input === "object" ? input : {};
  const imap_username = asString(firstPresent(req, ["imap_username", "imapUsername"]));
  if (!imap_username) return missingInput("imap_username");
  const imap_password = asString(firstPresent(req, ["imap_password", "imapPassword"]));
  if (!imap_password) return missingInput("imap_password");
  const imap_host = asString(firstPresent(req, ["imap_host", "imapHost"]));
  if (!imap_host) return missingInput("imap_host");
  const imap_port = asString(firstPresent(req, ["imap_port", "imapPort"]));
  if (!imap_port) return missingInput("imap_port");
  const imap_tls = asString(firstPresent(req, ["imap_tls", "imapTls"]));
  const body = {};
  body.imap_username = imap_username;
  body.imap_password = imap_password;
  body.imap_host = imap_host;
  body.imap_port = imap_port;
  if (imap_tls) body.imap_tls = imap_tls;
  return runAuthed("/api/v1/email-accounts/test-imap-connection", "POST", body, "IMAP_TESTED", "IMAP_TEST_FAILED");
}
