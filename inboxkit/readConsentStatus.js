/**
 * @description Read consent status once. Does not claim Emails connected. errored is terminal failure.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.consentRequestUid
 * @returns {Object}
 */
async function readConsentStatus(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const consentRequestUid = asString(req.consentRequestUid || req.requestId);
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", status: "", failure: "workspaceId is required" };
  }
  if (!consentRequestUid) {
    return { ok: false, outcome: "MISSING_REQUEST", status: "", failure: "consentRequestUid is required" };
  }
  try {
    const polled = await getConsentStatus({ workspaceId, consentRequestUid });
    const status = asString(polled.status);
    if (isTerminalConsentFailure(status)) {
      return {
        ok: false,
        outcome: "CONSENT_TERMINAL_ERROR",
        status,
        consentRequestUid: asString(polled.consentRequestUid || consentRequestUid),
        mailboxUid: asString(polled.mailboxUid),
        mailboxEmail: asString(polled.mailboxEmail),
        emailsConnected: false,
        failure: asString(polled.statusReason || polled.statusText) || `Consent status ${status}`,
      };
    }
    if (isTerminalConsentSuccess(status)) {
      return {
        ok: true,
        outcome: "CONSENT_ACCEPTED_INBOXKIT",
        status,
        consentRequestUid: asString(polled.consentRequestUid || consentRequestUid),
        mailboxUid: asString(polled.mailboxUid),
        mailboxEmail: asString(polled.mailboxEmail),
        emailsConnected: false,
        failure: "",
      };
    }
    return {
      ok: false,
      outcome: "CONSENT_PENDING",
      status,
      consentRequestUid: asString(polled.consentRequestUid || consentRequestUid),
      mailboxUid: asString(polled.mailboxUid),
      mailboxEmail: asString(polled.mailboxEmail),
      emailsConnected: false,
      failure: asString(polled.statusReason || polled.statusText) || "Consent not terminal yet",
    };
  } catch (error) {
    return {
      ok: false,
      outcome: "CONSENT_STATUS_ERROR",
      status: "",
      consentRequestUid,
      emailsConnected: false,
      failure: asString(error && error.message) || "Consent status read failed",
    };
  }
}
