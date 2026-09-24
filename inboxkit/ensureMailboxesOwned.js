/**
 * @description Idempotent mailbox ensure: list active+pending, buy only missing expected emails, reconcile.
 * Requires purchaseConfirmed=true when any expected mailbox is missing. Never re-buys an already present expected set.
 * SUCCEEDED (ok) only when every expected address is present and active. Pending → RETRYING. Buy/permanent errors → FAILED.
 * Natural key: username@domainName.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.domainName
 * @param {string|string[]} input.usernames
 * @param {boolean|string} [input.purchaseConfirmed] - Required when spend is needed
 * @param {string} [input.firstNames]
 * @param {string} [input.lastNames]
 * @param {string} [input.platform]
 * @param {string|boolean} [input.useWalletBalance]
 * @returns {Object}
 */
async function ensureMailboxesOwned(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domainName = asString(req.domainName || req.domain).toLowerCase();
  const usernames = asCsvList(req.usernames).map((username) => username.toLowerCase());
  const purchaseConfirmed = asBoolean(req.purchaseConfirmed, false);
  const platform = (asString(req.platform) || "GOOGLE").toUpperCase();
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", expectedEmails: [], activeEmails: [], pendingEmails: [], missingEmails: [], purchasedCount: 0, expectedCount: 0, activeCount: 0, pendingCount: 0, failure: "workspaceId is required" };
  }
  if (!domainName) {
    return { ok: false, outcome: "MISSING_DOMAIN", expectedEmails: [], activeEmails: [], pendingEmails: [], missingEmails: [], purchasedCount: 0, expectedCount: 0, activeCount: 0, pendingCount: 0, failure: "domainName is required" };
  }
  if (!usernames.length) {
    return { ok: false, outcome: "MISSING_USERNAMES", expectedEmails: [], activeEmails: [], pendingEmails: [], missingEmails: [], purchasedCount: 0, expectedCount: 0, activeCount: 0, pendingCount: 0, failure: "usernames is required" };
  }
  const expectedEmails = usernames.map((username) => expectedMailboxEmail(username, domainName)).filter(Boolean);
  const expectedSet = new Set(expectedEmails);
  let listed;
  try {
    listed = await listGoogleMailboxes({
      workspaceId,
      domain: domainName,
      statuses: "active,pending",
      allPages: true,
    });
  } catch (error) {
    return {
      ok: false,
      outcome: "LIST_FAILED",
      expectedEmails,
      activeEmails: [],
      pendingEmails: [],
      missingEmails: expectedEmails,
      purchasedCount: 0,
      expectedCount: expectedEmails.length,
      activeCount: 0,
      pendingCount: 0,
      failure: asString(error && error.message) || "Failed to list InboxKit mailboxes",
    };
  }
  const existing = (listed.mailboxes || []).filter((mailbox) => expectedSet.has(asString(mailbox.email).toLowerCase()));
  const byEmail = new Map(existing.map((mailbox) => [asString(mailbox.email).toLowerCase(), mailbox]));
  const presentEmails = expectedEmails.filter((email) => byEmail.has(email));
  const missingEmails = expectedEmails.filter((email) => !byEmail.has(email));
  const activeEmails = expectedEmails.filter((email) => {
    const row = byEmail.get(email);
    return row && isActiveMailboxStatus(row.status);
  });
  const pendingEmails = expectedEmails.filter((email) => {
    const row = byEmail.get(email);
    return row && isPresentMailboxStatus(row.status) && !isActiveMailboxStatus(row.status);
  });
  let purchasedCount = 0;
  let purchased = [];
  let buyFailure = "";
  if (missingEmails.length) {
    if (!purchaseConfirmed) {
      return {
        ok: false,
        outcome: "PURCHASE_NOT_CONFIRMED",
        expectedEmails,
        activeEmails,
        pendingEmails,
        missingEmails,
        purchasedCount: 0,
        expectedCount: expectedEmails.length,
        activeCount: activeEmails.length,
        pendingCount: pendingEmails.length,
        alreadyPresentCount: presentEmails.length,
        toBuyCount: missingEmails.length,
        budgetSummary: `expected=${expectedEmails.length} present=${presentEmails.length} missing=${missingEmails.length} wouldBuy=${missingEmails.length}`,
        failure: `purchaseConfirmed=true required to buy ${missingEmails.length} missing mailbox(es): ${missingEmails.join(", ")}`,
      };
    }
    const missingUsernames = missingEmails.map((email) => email.split("@")[0]).filter(Boolean);
    const usernameIndex = new Map(usernames.map((username, index) => [username, index]));
    const firstNames = asCsvList(req.firstNames);
    const lastNames = asCsvList(req.lastNames);
    const buyFirstNames = missingUsernames.map((username) => firstNames[usernameIndex.get(username)] || "");
    const buyLastNames = missingUsernames.map((username) => lastNames[usernameIndex.get(username)] || "");
    try {
      const bought = await buyMailboxes({
        workspaceId,
        domainName,
        usernames: missingUsernames,
        firstNames: buyFirstNames,
        lastNames: buyLastNames,
        platform,
        useWalletBalance: req.useWalletBalance,
      });
      purchased = bought.mailboxes || [];
      purchasedCount = purchased.length;
    } catch (error) {
      buyFailure = asString(error && error.message) || "Mailbox buy failed";
      return {
        ok: false,
        outcome: "BUY_FAILED",
        expectedEmails,
        activeEmails,
        pendingEmails,
        missingEmails,
        purchasedCount: 0,
        expectedCount: expectedEmails.length,
        activeCount: activeEmails.length,
        pendingCount: pendingEmails.length,
        alreadyPresentCount: presentEmails.length,
        toBuyCount: missingEmails.length,
        budgetSummary: `expected=${expectedEmails.length} present=${presentEmails.length} missing=${missingEmails.length} purchased=0`,
        failure: buyFailure,
      };
    }
  }
  let reconciled;
  try {
    reconciled = await listGoogleMailboxes({
      workspaceId,
      domain: domainName,
      statuses: "active,pending",
      allPages: true,
    });
  } catch (error) {
    return {
      ok: false,
      outcome: "RECONCILE_FAILED",
      expectedEmails,
      activeEmails,
      pendingEmails,
      missingEmails,
      purchased,
      purchasedCount,
      expectedCount: expectedEmails.length,
      activeCount: activeEmails.length,
      pendingCount: pendingEmails.length,
      budgetSummary: `expected=${expectedEmails.length} purchased=${purchasedCount}`,
      failure: asString(error && error.message) || "Failed to reconcile mailboxes after buy",
    };
  }
  const reconciledRows = (reconciled.mailboxes || []).filter((mailbox) => expectedSet.has(asString(mailbox.email).toLowerCase()));
  const reconciledByEmail = new Map(reconciledRows.map((mailbox) => [asString(mailbox.email).toLowerCase(), mailbox]));
  const finalActive = expectedEmails.filter((email) => {
    const row = reconciledByEmail.get(email);
    return row && isActiveMailboxStatus(row.status);
  });
  const finalPending = expectedEmails.filter((email) => {
    const row = reconciledByEmail.get(email);
    return row && isPresentMailboxStatus(row.status) && !isActiveMailboxStatus(row.status);
  });
  const finalMissing = expectedEmails.filter((email) => !reconciledByEmail.has(email));
  const budgetSummary = `expected=${expectedEmails.length} active=${finalActive.length} pending=${finalPending.length} missing=${finalMissing.length} purchasedThisRun=${purchasedCount}`;
  if (finalMissing.length) {
    return {
      ok: false,
      outcome: buyFailure ? "BUY_FAILED" : "MAILBOXES_MISSING",
      expectedEmails,
      activeEmails: finalActive,
      pendingEmails: finalPending,
      missingEmails: finalMissing,
      purchased,
      purchasedCount,
      expectedCount: expectedEmails.length,
      activeCount: finalActive.length,
      pendingCount: finalPending.length,
      budgetSummary,
      failure: buyFailure || `Missing expected mailboxes after reconcile: ${finalMissing.join(", ")}`,
    };
  }
  if (finalPending.length || finalActive.length !== expectedEmails.length) {
    return {
      ok: false,
      outcome: "MAILBOXES_PENDING",
      retryable: true,
      expectedEmails,
      activeEmails: finalActive,
      pendingEmails: finalPending,
      missingEmails: [],
      purchased,
      purchasedCount,
      expectedCount: expectedEmails.length,
      activeCount: finalActive.length,
      pendingCount: finalPending.length,
      budgetSummary,
      failure: `Pending mailboxes: ${finalPending.join(", ") || "activation incomplete"}`,
    };
  }
  return {
    ok: true,
    outcome: "MAILBOXES_ACTIVE",
    retryable: false,
    expectedEmails,
    activeEmails: finalActive,
    pendingEmails: [],
    missingEmails: [],
    purchased,
    purchasedCount,
    expectedCount: expectedEmails.length,
    activeCount: finalActive.length,
    pendingCount: 0,
    budgetSummary,
    failure: "",
  };
}
