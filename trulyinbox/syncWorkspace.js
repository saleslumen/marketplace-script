/**
 * @description Start bulk-connect sync. Default enableWarmup is true. SMTP connect is never used.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {boolean|string} [input.selectAll]
 * @param {string|string[]} [input.selectedDomains]
 * @param {string|string[]} [input.emailsToConnect]
 * @param {boolean|string} [input.enableWarmup]
 * @param {string} [input.tagName]
 * @param {string|string[]} [input.deselect]
 * @param {string|string[]} [input.emailAccountIdsToDelete]
 * @returns {Object}
 */
async function syncWorkspace(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId || req.trulyInboxWorkspaceId);
  const emailsToConnect = uniqueLower(req.emailsToConnect || req.expectedEmails || req.emails);
  const selectedDomains = uniqueLower(req.selectedDomains || req.domains || req.domain);
  const deselect = uniqueLower(req.deselect);
  const emailAccountIdsToDelete = asCsvList(req.emailAccountIdsToDelete);
  const enableWarmup = asBoolean(req.enableWarmup, true);
  const tagName = asString(req.tagName);
  const explicitSelectAll = Object.prototype.hasOwnProperty.call(req, "selectAll");
  const selectAll = explicitSelectAll ? asBoolean(req.selectAll, false) : emailsToConnect.length === 0;
  if (!workspaceId) {
    return ensureFailure("MISSING_WORKSPACE", "workspaceId is required", { retryable: false });
  }
  if (!selectAll && !emailsToConnect.length) {
    return ensureFailure("MISSING_SYNC_SELECTION", "emailsToConnect is required when selectAll is false", {
      retryable: false,
      workspaceId,
    });
  }
  if (selectAll && !selectedDomains.length) {
    return ensureFailure("MISSING_SYNC_SELECTION", "selectedDomains is required when selectAll is true", {
      retryable: false,
      workspaceId,
    });
  }
  const body = {
    selectAll,
    enableWarmup,
  };
  if (selectAll) {
    if (selectedDomains.length) body.selectedDomains = selectedDomains;
    if (deselect.length) body.deselect = deselect;
  } else {
    body.emailsToConnect = emailsToConnect;
  }
  if (emailAccountIdsToDelete.length) body.emailAccountIdsToDelete = emailAccountIdsToDelete;
  if (tagName) body.tagName = tagName;
  const classified = classifyHttp(await trulyinboxRequestRaw(`/workspaces/${encodeURIComponent(workspaceId)}/sync`, "POST", body));
  if (classified.status === 429 || classified.retryable) {
    return ensureFailure("RATE_LIMITED", classified.message || "TrulyInbox rate limited (20 req/min)", {
      retryable: true,
      workspaceId,
    });
  }
  if (classified.status === 422) {
    const delegation = isDelegationFailure(classified);
    return ensureFailure(delegation ? "DELEGATION_MISSING" : "SYNC_REJECTED", classified.message || "Sync rejected", {
      retryable: false,
      human: delegation,
      workspaceId,
    });
  }
  if (classified.status === 409) {
    const reusedJobId = asString(classified.body.jobId);
    if (reusedJobId) {
      return {
        ok: true,
        outcome: "SYNC_REUSED",
        workspaceId,
        jobId: reusedJobId,
        status: asString(classified.body.status) || "conflict",
        enableWarmup,
        retryable: false,
        failure: "",
      };
    }
    return ensureFailure("WORKSPACE_SYNC_CONFLICT", classified.message || "Sync conflict without a reusable jobId", {
      retryable: false,
      workspaceId,
    });
  }
  if (classified.status === 404) {
    return ensureFailure("WORKSPACE_INVALID", classified.message || "Workspace not found for sync", {
      retryable: false,
      workspaceId,
    });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return ensureFailure("SYNC_REJECTED", classified.message || `Sync failed (${classified.status})`, {
      retryable: false,
      workspaceId,
    });
  }
  const jobId = asString(classified.body.jobId);
  if (!jobId) {
    return ensureFailure("SYNC_UNPROVEN", "Sync response omitted jobId", { retryable: false, workspaceId });
  }
  return {
    ok: true,
    outcome: "SYNC_ACCEPTED",
    workspaceId,
    jobId,
    status: asString(classified.body.status) || "processing",
    enableWarmup,
    selectAll,
    emailsToConnect,
    selectedDomains,
    tagName,
    retryable: false,
    failure: "",
  };
}
