/**
 * @description Return active Google mailboxes that are not already present in connectedEmails (from Emails list).
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} [input.connectedEmails]
 * @param {string} [input.domain]
 * @returns {Object}
 */
async function listMailboxesNeedingConsent(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  if (!workspaceId) {
    return {
      ok: false,
      outcome: "MISSING_WORKSPACE",
      mailboxes: [],
      expectedEmails: [],
      failure: "workspaceId is required",
    };
  }
  let listed;
  try {
    listed = await listActiveGoogleMailboxes({
      workspaceId,
      allPages: true,
      domain: req.domain,
      keyword: req.keyword,
      limit: req.limit || "50",
    });
  } catch (error) {
    return {
      ok: false,
      outcome: "LIST_FAILED",
      mailboxes: [],
      expectedEmails: [],
      failure: asString(error && error.message) || "Failed to list mailboxes",
    };
  }
  const connected = new Set(asCsvList(req.connectedEmails || req.emails).map((email) => email.toLowerCase()));
  const all = Array.isArray(listed.mailboxes) ? listed.mailboxes : [];
  const expectedEmails = all.map((row) => asString(row.email)).filter(Boolean);
  const needing = all.filter((row) => {
    const email = asString(row.email).toLowerCase();
    return email && !connected.has(email);
  });
  const alreadyConnected = all.filter((row) => connected.has(asString(row.email).toLowerCase()));
  return {
    ok: true,
    outcome: needing.length ? "NEEDS_CONSENT" : "ALL_ALREADY_CONNECTED",
    workspaceId,
    mailboxes: needing,
    expectedEmails,
    expectedEmailsCsv: expectedEmails.join(","),
    expectedCount: expectedEmails.length,
    needingCount: needing.length,
    alreadyConnectedCount: alreadyConnected.length,
    total: listed.total || all.length,
    failure: expectedEmails.length ? "" : "No active Google mailboxes to connect",
  };
}
