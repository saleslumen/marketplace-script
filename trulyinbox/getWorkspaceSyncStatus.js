/**
 * @description Read one sync job. jobId is required; workspaceId alone cannot identify the run. Finished state is retained 12h, then null.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} input.jobId
 * @returns {Object}
 */
async function getWorkspaceSyncStatus(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId || req.trulyInboxWorkspaceId);
  const jobId = asString(req.jobId || req.syncJobId || req.trulyInboxSyncJobId);
  if (!workspaceId) {
    return ensureFailure("MISSING_WORKSPACE", "workspaceId is required", { retryable: false });
  }
  if (!jobId) {
    return ensureFailure("MISSING_JOB_ID", "jobId is required; workspaceId alone cannot identify a sync run", {
      retryable: false,
      workspaceId,
    });
  }
  const query = buildQuery({ jobId });
  const classified = classifyHttp(await trulyinboxRequestRaw(`/workspaces/${encodeURIComponent(workspaceId)}/sync-status${query}`, "GET"));
  if (classified.status === 429 || classified.retryable) {
    return ensureFailure("RATE_LIMITED", classified.message || "TrulyInbox rate limited (20 req/min)", {
      retryable: true,
      workspaceId,
      jobId,
    });
  }
  if (classified.status === 404) {
    return ensureFailure("SYNC_STATUS_MISSING", classified.message || "Sync-status 404", {
      retryable: false,
      workspaceId,
      jobId,
    });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return ensureFailure("SYNC_STATUS_REJECTED", classified.message || `Sync-status failed (${classified.status})`, {
      retryable: false,
      workspaceId,
      jobId,
    });
  }
  const state = classified.body.state;
  const failedReason = asString(classified.body.failedReason);
  if (state === null || state === undefined || state === "") {
    return ensureFailure("SYNC_STATUS_EXPIRED", "Sync-status state is null (finished jobs are retained 12h)", {
      retryable: true,
      workspaceId,
      jobId,
    });
  }
  const normalized = asString(state).toLowerCase();
  if (normalized === "failed") {
    return ensureFailure("SYNC_FAILED", failedReason || "Sync job failed", {
      retryable: false,
      workspaceId,
      jobId,
    });
  }
  if (normalized === "completed") {
    return {
      ok: true,
      outcome: "SYNC_COMPLETED",
      workspaceId,
      jobId,
      state: normalized,
      failedReason: "",
      retryable: false,
      failure: "",
    };
  }
  return {
    ok: false,
    outcome: "SYNC_PROCESSING",
    workspaceId,
    jobId,
    state: normalized,
    failedReason,
    retryable: true,
    failure: `Sync job state is ${normalized || "unknown"}; not treating undocumented states as completed`,
  };
}
