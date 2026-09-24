/**
 * @description Preview mailboxes not yet connected. Failed credentials delete the workspace registration.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} [input.domain] - Comma-separated domains.
 * @param {string} [input.search]
 * @returns {Object}
 */
async function previewWorkspaceMailboxes(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId || req.trulyInboxWorkspaceId);
  if (!workspaceId) {
    return ensureFailure("MISSING_WORKSPACE", "workspaceId is required", { retryable: false });
  }
  const query = buildQuery({
    search: asString(req.search),
    domain: asString(req.domain || asCsvList(req.domains || req.selectedDomains).join(",")),
  });
  const classified = classifyHttp(await trulyinboxRequestRaw(`/workspaces/${encodeURIComponent(workspaceId)}/preview${query}`, "GET"));
  if (classified.status === 429 || classified.retryable) {
    return ensureFailure("RATE_LIMITED", classified.message || "TrulyInbox rate limited (20 req/min)", {
      retryable: true,
      workspaceId,
    });
  }
  if (classified.status === 404) {
    return ensureFailure("WORKSPACE_INVALID", classified.message || "Workspace preview 404; registration is deleted when credentials fail", {
      retryable: false,
      workspaceId,
    });
  }
  if (classified.status === 422) {
    const delegation = isDelegationFailure(classified);
    return ensureFailure(delegation ? "DELEGATION_MISSING" : "PREVIEW_REJECTED", classified.message || `Preview failed (${classified.status})`, {
      retryable: false,
      human: delegation,
      workspaceId,
    });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return ensureFailure("PREVIEW_REJECTED", classified.message || `Preview failed (${classified.status})`, {
      retryable: classified.retryable,
      workspaceId,
    });
  }
  const newEmails = (Array.isArray(classified.body.newEmails) ? classified.body.newEmails : []).map((row) => ({
    email: asString(row.email).toLowerCase(),
    displayName: asString(row.displayName),
    domain: asString(row.domain || emailDomain(row.email)).toLowerCase(),
  })).filter((row) => row.email);
  const total = asNumber(classified.body.total, newEmails.length);
  const page = asNumber(classified.body.page, 1);
  const limit = asNumber(classified.body.limit, newEmails.length);
  const truncated = Number.isFinite(total) && total > newEmails.length;
  return {
    ok: true,
    outcome: truncated ? "PREVIEW_TRUNCATED" : "PREVIEWED",
    retryable: false,
    workspaceId,
    newEmails,
    total,
    page,
    limit,
    connectedCount: asNumber(classified.body.connectedCount, 0),
    domains: Array.isArray(classified.body.domains)
      ? classified.body.domains.map((row) => ({
        domain: asString(row.domain).toLowerCase(),
        count: asNumber(row.count, 0),
      })).filter((row) => row.domain)
      : [],
    truncated,
    failure: truncated
      ? "Preview page is incomplete and page/limit query parameters are not documented; fail-closed unless emailsToConnect is used"
      : "",
  };
}
