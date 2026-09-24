/**
 * @description Diff active Zapmail Google mailboxes against Emails-connected addresses.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} [input.connectedEmails]
 * @param {string} [input.domain]
 */
async function listMailboxesNeedingConsent(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", mailboxes: [], needingCount: 0, expectedCount: 0, failure: "workspaceId is required" };
  }
  let listed;
  try {
    listed = await listActiveGoogleMailboxes({ workspaceId, domain: req.domain });
  } catch (error) {
    return {
      ok: false,
      outcome: "LIST_FAILED",
      mailboxes: [],
      needingCount: 0,
      expectedCount: 0,
      failure: asString(error && error.message) || "Failed to list Zapmail mailboxes",
    };
  }
  const connected = new Set(asCsvList(req.connectedEmails).map((email) => email.toLowerCase()));
  const mailboxes = listed.mailboxes || [];
  const needing = mailboxes.filter((mailbox) => !connected.has(asString(mailbox.email).toLowerCase()));
  const expectedEmails = mailboxes.map((mailbox) => mailbox.email).filter(Boolean);
  return {
    ok: true,
    outcome: needing.length ? "NEEDS_CONSENT" : "ALL_ALREADY_CONNECTED",
    mailboxes: needing,
    needingCount: needing.length,
    expectedCount: mailboxes.length,
    expectedEmails,
    expectedEmailsCsv: expectedEmails.join(","),
    failure: "",
  };
}
