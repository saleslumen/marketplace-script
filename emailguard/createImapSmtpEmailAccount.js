/**
 * @description Create an IMAP/SMTP email account. Passwords are sent to EmailGuard only and never returned.
 * @param {Object} input
 * @returns {Object}
 */
async function createImapSmtpEmailAccount(input) {
  const req = input && typeof input === "object" ? input : {};
  const name = asString(firstPresent(req, ["name"]));
  if (!name) return missingInput("name");
  const providerRaw = firstPresent(req, ["provider"]);
  const provider = asNumber(providerRaw, NaN);
  if (!Number.isFinite(provider)) return missingInput("provider");
  const imap_username = asString(firstPresent(req, ["imap_username", "imapUsername"]));
  if (!imap_username) return missingInput("imap_username");
  const imap_password = asString(firstPresent(req, ["imap_password", "imapPassword"]));
  if (!imap_password) return missingInput("imap_password");
  const imap_host = asString(firstPresent(req, ["imap_host", "imapHost"]));
  if (!imap_host) return missingInput("imap_host");
  const imap_port = asString(firstPresent(req, ["imap_port", "imapPort"]));
  if (!imap_port) return missingInput("imap_port");
  const imap_tls = asString(firstPresent(req, ["imap_tls", "imapTls"]));
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
  body.name = name;
  body.provider = provider;
  body.imap_username = imap_username;
  body.imap_password = imap_password;
  body.imap_host = imap_host;
  body.imap_port = imap_port;
  if (imap_tls) body.imap_tls = imap_tls;
  body.smtp_username = smtp_username;
  body.smtp_password = smtp_password;
  body.smtp_host = smtp_host;
  body.smtp_port = smtp_port;
  body.smtp_tls = smtp_tls;
  return runAuthed("/api/v1/email-accounts/imap-smtp", "POST", body, "EMAIL_ACCOUNT_CREATED", "EMAIL_ACCOUNT_CREATE_FAILED");
}
