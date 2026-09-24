/**
 * @description List active Google mailboxes across pages.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} [input.domain]
 * @returns {Object}
 */
async function listActiveGoogleMailboxes(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  if (!workspaceId) throw new Error("ZAPMAIL_REQUEST_FAILED: workspaceId is required");
  const mailboxes = [];
  let page = 1;
  let totalPages = 1;
  for (let i = 0; i < 50; i += 1) {
    const listed = await listMailboxes({
      workspaceId,
      domain: req.domain,
      page: String(page),
      limit: "50",
    });
    (listed.mailboxes || []).forEach((mailbox) => {
      if (isActiveMailboxStatus(mailbox.status)) mailboxes.push(mailbox);
    });
    totalPages = asNumber(listed.totalPages, 1);
    if (page >= totalPages) break;
    page += 1;
  }
  return { mailboxes, count: mailboxes.length };
}
