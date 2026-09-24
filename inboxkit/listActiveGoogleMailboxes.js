/**
 * @description List active Google mailboxes. When allPages is true (default for organization helpers), walks InboxKit pages.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|boolean} [input.allPages] - Default true
 * @param {string|number} [input.page]
 * @param {string|number} [input.limit]
 * @param {string} [input.keyword]
 * @param {string} [input.domain]
 * @returns {Object}
 */
async function listActiveGoogleMailboxes(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  if (!workspaceId) throw new Error("INBOXKIT_REQUEST_FAILED: workspaceId is required");
  return listGoogleMailboxesByStatus(workspaceId, "active", {
    allPages: req.allPages,
    page: req.page,
    limit: req.limit,
    keyword: req.keyword,
    domain: req.domain,
  });
}
