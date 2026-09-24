/**
 * @description Initiate consent for mailboxes using one fresh consent URL per mailbox. Aggregates terminal failures for workflow branching (no forEach required).
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {Object[]} input.mailboxes - From listMailboxesNeedingConsent
 * @param {string|string[]} input.consentUrls - Parallel Emails OAuth URLs (same length as mailboxes)
 * @param {string|string[]} [input.connectedEmails] - When mailboxes omitted, plan via listMailboxesNeedingConsent
 * @returns {Object}
 * @property {boolean} ok - True when every initiate succeeded (or nothing needed)
 * @property {boolean} hasTerminalFailures - True when any InboxKit terminal consent error occurred
 * @property {string} outcome
 */
async function initiateConsentsForMailboxes(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  if (!workspaceId) {
    return {
      ok: false,
      outcome: "MISSING_WORKSPACE",
      hasTerminalFailures: false,
      consentRequestUids: [],
      expectedEmails: [],
      failure: "workspaceId is required",
    };
  }
  let mailboxes = asMailboxList(req.mailboxes);
  let expectedEmails = asCsvList(req.expectedEmails);
  if (!mailboxes.length) {
    const planned = await listMailboxesNeedingConsent({
      workspaceId,
      connectedEmails: req.connectedEmails,
      domain: req.domain,
      keyword: req.keyword,
    });
    if (!planned.ok) {
      return {
        ok: false,
        outcome: planned.outcome,
        hasTerminalFailures: false,
        consentRequestUids: [],
        expectedEmails: planned.expectedEmails || [],
        failure: planned.failure,
      };
    }
    mailboxes = planned.mailboxes || [];
    expectedEmails = planned.expectedEmails || [];
    if (!expectedEmails.length) {
      return {
        ok: false,
        outcome: "NO_MAILBOXES",
        hasTerminalFailures: false,
        consentRequestUids: [],
        expectedEmails: [],
        failure: "No active Google mailboxes to connect",
      };
    }
    if (!mailboxes.length) {
      return {
        ok: true,
        outcome: "ALL_ALREADY_CONNECTED",
        hasTerminalFailures: false,
        consentRequestUids: [],
        expectedEmails,
        initiatedCount: 0,
        failedCount: 0,
        terminalFailureCount: 0,
        needingCount: 0,
        failure: "",
      };
    }
  }
  const consentUrls = asConsentUrlList(req.consentUrls || req.authUrls);
  if (consentUrls.length !== mailboxes.length) {
    return {
      ok: false,
      outcome: "CONSENT_URL_COUNT_MISMATCH",
      hasTerminalFailures: false,
      consentRequestUids: [],
      expectedEmails,
      needingCount: mailboxes.length,
      failure: `Expected ${mailboxes.length} consent URL(s), got ${consentUrls.length}`,
    };
  }
  const consentRequestUids = [];
  const results = [];
  const terminalFailures = [];
  const softFailures = [];
  let initiatedCount = 0;
  for (let index = 0; index < mailboxes.length; index += 1) {
    const mailbox = mailboxes[index];
    const initiated = await initiateConsentSafe({
      workspaceId,
      consentUrl: consentUrls[index],
      mailboxUid: mailbox.uid,
      username: mailbox.username,
      domain: mailbox.domainName || mailbox.domain,
      email: mailbox.email,
    });
    if (asString(initiated.consentRequestUid)) consentRequestUids.push(asString(initiated.consentRequestUid));
    const row = { email: asString(mailbox.email), mailboxUid: asString(mailbox.uid), ...initiated };
    results.push(row);
    if (initiated.ok) {
      initiatedCount += 1;
      continue;
    }
    if (asString(initiated.outcome) === "CONSENT_TERMINAL_ERROR" || isTerminalConsentFailure(initiated.status)) {
      terminalFailures.push(row);
    } else {
      softFailures.push(row);
    }
  }
  const hasTerminalFailures = terminalFailures.length > 0;
  const failedCount = terminalFailures.length + softFailures.length;
  if (hasTerminalFailures) {
    return {
      ok: false,
      outcome: "CONSENT_TERMINAL_FAILURES",
      hasTerminalFailures: true,
      consentRequestUids,
      expectedEmails,
      initiatedCount,
      failedCount,
      terminalFailureCount: terminalFailures.length,
      softFailureCount: softFailures.length,
      needingCount: mailboxes.length,
      results,
      terminalFailures,
      emailsConnected: false,
      failure: terminalFailures
        .map((row) => `${row.email || row.mailboxUid}:${row.failure || row.status || row.outcome}`)
        .join("; "),
    };
  }
  if (failedCount) {
    return {
      ok: false,
      outcome: "CONSENT_INITIATE_ERRORS",
      hasTerminalFailures: false,
      consentRequestUids,
      expectedEmails,
      initiatedCount,
      failedCount,
      terminalFailureCount: 0,
      softFailureCount: softFailures.length,
      needingCount: mailboxes.length,
      results,
      emailsConnected: false,
      failure: softFailures.map((row) => `${row.email || row.mailboxUid}:${row.failure || row.outcome}`).join("; "),
    };
  }
  return {
    ok: true,
    outcome: "CONSENT_INITIATED",
    hasTerminalFailures: false,
    consentRequestUids,
    expectedEmails,
    initiatedCount,
    failedCount: 0,
    terminalFailureCount: 0,
    softFailureCount: 0,
    needingCount: mailboxes.length,
    results,
    emailsConnected: false,
    failure: "",
  };
}
