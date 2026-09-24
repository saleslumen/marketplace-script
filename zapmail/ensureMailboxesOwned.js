/**
 * @description Idempotent mailbox ensure: list, assign only missing, reconcile. purchaseConfirmed required to spend slots.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.domainName
 * @param {string|string[]} input.usernames
 * @param {boolean|string} [input.purchaseConfirmed]
 */
async function ensureMailboxesOwned(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domainName = asString(req.domainName || req.domain).toLowerCase();
  const usernames = asCsvList(req.usernames).map((username) => username.toLowerCase());
  const purchaseConfirmed = asBoolean(req.purchaseConfirmed, false);
  const empty = {
    expectedEmails: [],
    activeEmails: [],
    pendingEmails: [],
    missingEmails: [],
    purchasedCount: 0,
    expectedCount: 0,
    activeCount: 0,
    pendingCount: 0,
  };
  if (!workspaceId) return { ok: false, outcome: "MISSING_WORKSPACE", ...empty, failure: "workspaceId is required" };
  if (!domainName) return { ok: false, outcome: "MISSING_DOMAIN", ...empty, failure: "domainName is required" };
  if (!usernames.length) return { ok: false, outcome: "MISSING_USERNAMES", ...empty, failure: "usernames is required" };
  const expectedEmails = usernames.map((username) => expectedMailboxEmail(username, domainName)).filter(Boolean);
  let existing;
  try {
    existing = await listPresentMailboxes(workspaceId, domainName);
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
      retryable: isRetryableRequestError(error),
      failure: asString(error && error.message) || "Failed to list Zapmail mailboxes",
    };
  }
  const byEmail = new Map(existing.map((mailbox) => [asString(mailbox.email).toLowerCase(), mailbox]));
  const missingEmails = expectedEmails.filter((email) => !byEmail.has(email));
  let purchasedCount = 0;
  if (missingEmails.length) {
    const onDomainCount = existing.filter((mailbox) => asString(mailbox.domainName).toLowerCase() === domainName).length;
    const projectedCount = onDomainCount + missingEmails.length;
    if (projectedCount > ZAPMAIL_MAX_MAILBOXES_PER_DOMAIN) {
      return {
        ok: false,
        outcome: "DOMAIN_MAILBOX_LIMIT",
        retryable: false,
        expectedEmails,
        activeEmails: expectedEmails.filter((email) => isActiveMailboxStatus((byEmail.get(email) || {}).status)),
        pendingEmails: expectedEmails.filter((email) => byEmail.has(email) && !isActiveMailboxStatus((byEmail.get(email) || {}).status)),
        missingEmails,
        purchasedCount: 0,
        expectedCount: expectedEmails.length,
        activeCount: 0,
        pendingCount: 0,
        failure: `Zapmail allows at most ${ZAPMAIL_MAX_MAILBOXES_PER_DOMAIN} mailboxes per domain; projected=${projectedCount}`,
      };
    }
    if (!purchaseConfirmed) {
      return {
        ok: false,
        outcome: "PURCHASE_NOT_CONFIRMED",
        expectedEmails,
        activeEmails: expectedEmails.filter((email) => isActiveMailboxStatus((byEmail.get(email) || {}).status)),
        pendingEmails: expectedEmails.filter((email) => byEmail.has(email) && !isActiveMailboxStatus((byEmail.get(email) || {}).status)),
        missingEmails,
        purchasedCount: 0,
        expectedCount: expectedEmails.length,
        activeCount: 0,
        pendingCount: 0,
        failure: "purchaseConfirmed=true is required to assign missing Zapmail mailboxes",
      };
    }
    let domainId = asString(req.domainId);
    if (!domainId) {
      try {
        domainId = await resolveDomainId(workspaceId, domainName);
      } catch (error) {
        return {
          ok: false,
          outcome: "DOMAIN_RESOLVE_FAILED",
          expectedEmails,
          activeEmails: [],
          pendingEmails: [],
          missingEmails,
          purchasedCount: 0,
          expectedCount: expectedEmails.length,
          activeCount: 0,
          pendingCount: 0,
          failure: asString(error && error.message) || "Failed to resolve Zapmail domainId",
        };
      }
    }
    if (!domainId) {
      return {
        ok: false,
        outcome: "DOMAIN_NOT_FOUND",
        expectedEmails,
        activeEmails: [],
        pendingEmails: [],
        missingEmails,
        purchasedCount: 0,
        expectedCount: expectedEmails.length,
        activeCount: 0,
        pendingCount: 0,
        failure: `Zapmail domain ${domainName} is not listed; run Zapmail connect domain first`,
      };
    }
    const missingUsernames = missingEmails.map((email) => email.split("@")[0]);
    try {
      await assignMailboxes({
        workspaceId,
        domainName,
        domainId,
        usernames: missingUsernames,
        firstNames: req.firstNames,
        lastNames: req.lastNames,
      });
      purchasedCount = missingUsernames.length;
    } catch (error) {
      return {
        ok: false,
        outcome: "ASSIGN_FAILED",
        expectedEmails,
        activeEmails: [],
        pendingEmails: [],
        missingEmails,
        purchasedCount: 0,
        expectedCount: expectedEmails.length,
        activeCount: 0,
        pendingCount: 0,
        retryable: isRetryableRequestError(error),
        failure: asString(error && error.message) || "Zapmail mailbox assign failed",
      };
    }
    existing = await listPresentMailboxes(workspaceId, domainName);
  }
  const refreshed = new Map(existing.map((mailbox) => [asString(mailbox.email).toLowerCase(), mailbox]));
  const activeEmails = expectedEmails.filter((email) => isActiveMailboxStatus((refreshed.get(email) || {}).status));
  const pendingEmails = expectedEmails.filter((email) => refreshed.has(email) && !isActiveMailboxStatus((refreshed.get(email) || {}).status));
  const stillMissing = expectedEmails.filter((email) => !refreshed.has(email));
  const budgetSummary = `expected=${expectedEmails.length} active=${activeEmails.length} pending=${pendingEmails.length} assigned=${purchasedCount}`;
  if (stillMissing.length) {
    return {
      ok: false,
      outcome: "MAILBOXES_MISSING",
      expectedEmails,
      activeEmails,
      pendingEmails,
      missingEmails: stillMissing,
      purchasedCount,
      expectedCount: expectedEmails.length,
      activeCount: activeEmails.length,
      pendingCount: pendingEmails.length,
      budgetSummary,
      failure: `Still missing: ${stillMissing.join(", ")}`,
    };
  }
  if (pendingEmails.length) {
    return {
      ok: false,
      outcome: "MAILBOXES_PENDING",
      retryable: true,
      expectedEmails,
      activeEmails,
      pendingEmails,
      missingEmails: [],
      purchasedCount,
      expectedCount: expectedEmails.length,
      activeCount: activeEmails.length,
      pendingCount: pendingEmails.length,
      budgetSummary,
      failure: `Pending activation: ${pendingEmails.join(", ")}`,
    };
  }
  return {
    ok: true,
    outcome: "MAILBOXES_ACTIVE",
    expectedEmails,
    activeEmails,
    pendingEmails: [],
    missingEmails: [],
    purchasedCount,
    expectedCount: expectedEmails.length,
    activeCount: activeEmails.length,
    pendingCount: 0,
    budgetSummary,
    failure: "",
  };
}
