/**
 * @description Connect one mailbox with SMTP/IMAP credentials. Callers must supply passwords; they are sent to TrulyInbox only and never returned, logged, or persisted in the result.
 * @param {Object} input
 * @param {string} input.emailServiceProvider
 * @param {Object} input.smtp
 * @param {Object} input.imap
 * @param {string} [input.fromName]
 * @returns {Object}
 */
async function connectSmtpImapAccount(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailServiceProvider = asString(req.emailServiceProvider).toLowerCase();
  const smtpIn = req.smtp && typeof req.smtp === "object" ? req.smtp : {};
  const imapIn = req.imap && typeof req.imap === "object" ? req.imap : {};
  const missing = [];
  if (!SMTP_IMAP_PROVIDERS.includes(emailServiceProvider)) missing.push("emailServiceProvider");
  if (!asString(smtpIn.emailAddress)) missing.push("smtp.emailAddress");
  if (!asString(smtpIn.host)) missing.push("smtp.host");
  if (!Number.isFinite(asNumber(smtpIn.port, NaN))) missing.push("smtp.port");
  if (!asString(smtpIn.password)) missing.push("smtp.password");
  if (!hasOwnField(smtpIn, "encryption")) missing.push("smtp.encryption");
  if (!asString(imapIn.host)) missing.push("imap.host");
  if (!Number.isFinite(asNumber(imapIn.port, NaN))) missing.push("imap.port");
  if (!asString(imapIn.password)) missing.push("imap.password");
  if (!hasOwnField(imapIn, "encryption")) missing.push("imap.encryption");
  if (missing.length) {
    return {
      ok: false,
      outcome: "MISSING_SMTP_IMAP",
      retryable: false,
      failure: `Required fields missing: ${missing.join(", ")}`,
    };
  }
  const smtp = {
    emailAddress: asString(smtpIn.emailAddress).toLowerCase(),
    host: asString(smtpIn.host),
    port: asNumber(smtpIn.port, 0),
    password: asString(smtpIn.password),
    encryption: asBoolean(smtpIn.encryption, false),
  };
  if (asString(smtpIn.userName)) smtp.userName = asString(smtpIn.userName);
  const imap = {
    host: asString(imapIn.host),
    port: asNumber(imapIn.port, 0),
    password: asString(imapIn.password),
    encryption: asBoolean(imapIn.encryption, false),
  };
  if (asString(imapIn.emailAddress)) imap.emailAddress = asString(imapIn.emailAddress).toLowerCase();
  const body = { emailServiceProvider, smtp, imap };
  if (asString(req.fromName)) body.fromName = asString(req.fromName);
  const classified = classifyHttp(await trulyinboxRequestRaw("/email-accounts", "POST", body));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified);
  }
  if (classified.status === 409) {
    return {
      ok: false,
      outcome: "SMTP_ACCOUNT_CONFLICT",
      retryable: false,
      failure: classified.message || "SMTP/IMAP account already connected",
    };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "SMTP_IMAP_CONNECT_FAILED",
      retryable: false,
      failure: classified.message || `SMTP/IMAP connect failed (${classified.status})`,
    };
  }
  return {
    ok: true,
    outcome: "SMTP_IMAP_CONNECTED",
    retryable: false,
    failure: "",
    emailAccountId: asString(classified.body.emailAccountId),
    fromEmail: asString(classified.body.fromEmail).toLowerCase(),
    fromName: asString(classified.body.fromName),
    type: asString(classified.body.type),
    status: asString(classified.body.status).toLowerCase(),
  };
}
