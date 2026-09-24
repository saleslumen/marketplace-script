/**
 * @description List Google mailboxes for statuses (default active+pending). Paginated when allPages is true.
 * Natural key for expected set matching is username@domain (lowercase).
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} [input.statuses] - Default active,pending
 * @param {string|boolean} [input.allPages] - Default true
 * @param {string} [input.keyword]
 * @param {string} [input.domain]
 * @returns {Object}
 */
async function listGoogleMailboxes(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  if (!workspaceId) throw new Error("INBOXKIT_REQUEST_FAILED: workspaceId is required");
  const statuses = asCsvList(req.statuses || req.status || "active,pending").map((row) => row.toLowerCase());
  const unique = [];
  const byEmail = new Map();
  for (const status of statuses.length ? statuses : [""]) {
    const listed = await listGoogleMailboxesByStatus(workspaceId, status, {
      allPages: req.allPages,
      page: req.page,
      limit: req.limit,
      keyword: req.keyword,
      domain: req.domain || req.domainName,
    });
    for (const mailbox of listed.mailboxes || []) {
      const key = asString(mailbox.email).toLowerCase() || asString(mailbox.uid);
      if (!key || byEmail.has(key)) continue;
      byEmail.set(key, mailbox);
      unique.push(mailbox);
    }
  }
  return {
    mailboxes: unique,
    total: unique.length,
    fetched: unique.length,
    statuses,
  };
}
