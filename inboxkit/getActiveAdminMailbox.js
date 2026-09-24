/**
 * @description Load and validate one active Google admin mailbox. Automatic selection requires is_admin=true; otherwise exact admin email is required.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} [input.email] - Exact admin mailbox email (required when is_admin is absent)
 * @param {string} [input.domain]
 * @param {string} [input.keyword]
 * @returns {Object}
 */
async function getActiveAdminMailbox(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", mailboxUid: "", email: "", failure: "workspaceId is required" };
  }
  const preferredEmail = asString(req.email || req.adminEmail || req.adminMailboxEmail).toLowerCase();
  let listed;
  try {
    listed = await listActiveGoogleMailboxes({
      workspaceId,
      allPages: true,
      limit: req.limit || "50",
      domain: req.domain,
      keyword: preferredEmail ? "" : req.keyword,
    });
  } catch (error) {
    return {
      ok: false,
      outcome: "LIST_FAILED",
      mailboxUid: "",
      email: preferredEmail,
      failure: asString(error && error.message) || "Failed to list InboxKit mailboxes",
    };
  }
  const mailboxes = Array.isArray(listed.mailboxes) ? listed.mailboxes : [];
  let mailbox = null;
  if (preferredEmail) {
    mailbox = mailboxes.find((row) => asString(row.email).toLowerCase() === preferredEmail) || null;
    if (!mailbox) {
      return {
        ok: false,
        outcome: "ADMIN_MAILBOX_MISSING",
        mailboxUid: "",
        email: preferredEmail,
        failure: `No active Google mailbox matches admin email ${preferredEmail}`,
        total: listed.total || 0,
      };
    }
    if (mailbox.adminKnown && mailbox.isAdmin !== true) {
      return {
        ok: false,
        outcome: "MAILBOX_NOT_ADMIN",
        mailboxUid: asString(mailbox.uid),
        email: asString(mailbox.email),
        failure: "Selected mailbox is not marked is_admin=true in InboxKit",
      };
    }
  } else {
    const adminRows = mailboxes.filter((row) => row.isAdmin === true);
    if (!adminRows.length) {
      const anyAdminField = mailboxes.some((row) => row.adminKnown);
      return {
        ok: false,
        outcome: anyAdminField ? "ADMIN_MAILBOX_MISSING" : "ADMIN_EMAIL_REQUIRED",
        mailboxUid: "",
        email: "",
        failure: anyAdminField
          ? "No active Google mailbox with is_admin=true; pass exact admin email"
          : "InboxKit did not expose is_admin; pass exact admin email (never assume first mailbox)",
        total: listed.total || 0,
      };
    }
    if (adminRows.length > 1) {
      return {
        ok: false,
        outcome: "ADMIN_MAILBOX_AMBIGUOUS",
        mailboxUid: "",
        email: "",
        failure: "Multiple is_admin=true mailboxes; pass exact admin email",
        total: listed.total || 0,
      };
    }
    mailbox = adminRows[0];
  }
  if (!mailbox || !asString(mailbox.uid) || !asString(mailbox.email)) {
    return {
      ok: false,
      outcome: "ADMIN_MAILBOX_MISSING",
      mailboxUid: "",
      email: preferredEmail,
      failure: "No active Google admin mailbox found in InboxKit workspace",
      total: listed.total || 0,
    };
  }
  if (asString(mailbox.status).toLowerCase() && asString(mailbox.status).toLowerCase() !== "active") {
    return {
      ok: false,
      outcome: "ADMIN_MAILBOX_INACTIVE",
      mailboxUid: asString(mailbox.uid),
      email: asString(mailbox.email),
      failure: `Admin mailbox status is ${asString(mailbox.status)}`,
    };
  }
  return {
    ok: true,
    outcome: "ADMIN_MAILBOX_READY",
    workspaceId,
    mailboxUid: asString(mailbox.uid),
    email: asString(mailbox.email),
    username: asString(mailbox.username),
    domainName: asString(mailbox.domainName),
    isAdmin: mailbox.isAdmin === true,
    adminKnown: mailbox.adminKnown === true,
    status: asString(mailbox.status) || "active",
    failure: "",
  };
}
