/**
 * @description Initiate InboxKit consent without claiming Emails connected. Treats errored as terminal. Structured negatives for branching.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.consentUrl
 * @param {string} [input.mailboxUid]
 * @param {string} [input.username]
 * @param {string} [input.domain]
 * @param {string} [input.email]
 * @returns {Object}
 */
async function initiateConsentSafe(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const consentUrl = asString(req.consentUrl || req.authUrl);
  const mailboxUid = asString(req.mailboxUid || req.uid);
  const username = asString(req.username);
  const domain = asString(req.domain || req.domainName);
  const email = asString(req.email);
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", status: "", consentRequestUid: "", failure: "workspaceId is required" };
  }
  if (!consentUrl) {
    return { ok: false, outcome: "MISSING_CONSENT_URL", status: "", consentRequestUid: "", failure: "consentUrl is required" };
  }
  if (!mailboxUid && !(username && domain)) {
    return { ok: false, outcome: "MISSING_MAILBOX", status: "", consentRequestUid: "", failure: "mailboxUid or username+domain is required" };
  }
  try {
    const initiated = await initiateConsentRequest({
      workspaceId,
      consentUrl,
      mailboxUid,
      username,
      domain,
      email,
    });
    const status = asString(initiated.status);
    if (isTerminalConsentFailure(status)) {
      return {
        ok: false,
        outcome: "CONSENT_TERMINAL_ERROR",
        status,
        consentRequestUid: asString(initiated.consentRequestUid),
        mailboxUid: asString(initiated.mailboxUid || mailboxUid),
        mailboxEmail: asString(initiated.mailboxEmail || email),
        failure: `Consent initiate terminal status ${status}`,
      };
    }
    return {
      ok: true,
      outcome: isTerminalConsentSuccess(status) ? "CONSENT_ACCEPTED_INBOXKIT" : "CONSENT_INITIATED",
      status,
      consentRequestUid: asString(initiated.consentRequestUid),
      mailboxUid: asString(initiated.mailboxUid || mailboxUid),
      mailboxEmail: asString(initiated.mailboxEmail || email),
      emailsConnected: false,
      failure: "",
    };
  } catch (error) {
    const failure = asString(error && error.message) || "Consent initiate failed";
    return {
      ok: false,
      outcome: "CONSENT_INITIATE_ERROR",
      status: "",
      consentRequestUid: "",
      mailboxUid,
      mailboxEmail: email,
      emailsConnected: false,
      failure,
    };
  }
}
