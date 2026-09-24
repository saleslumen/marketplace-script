/**
 * @description Idempotent Google Workspace warmup: reuse or register workspace, preview, sync expected mailboxes, prove connected+warmup.
 * Does not sleep-poll. Returns RETRYING so the workflow can rerun with jobId. ok only with documented connected+warmup proof. Never returns API keys or passwords.
 * @param {Object} input
 * @param {string} [input.adminEmail]
 * @param {string} [input.workspaceId]
 * @param {string} [input.trulyInboxWorkspaceId]
 * @param {string|string[]} [input.emailsToConnect]
 * @param {string|string[]} [input.expectedEmails]
 * @param {string|string[]} [input.selectedDomains]
 * @param {string|string[]} [input.domains]
 * @param {boolean|string} [input.enableWarmup]
 * @param {string} [input.tagName]
 * @param {string} [input.jobId]
 * @returns {Object}
 */
async function ensureGoogleWorkspaceWarmup(input) {
  const req = input && typeof input === "object" ? input : {};
  const adminEmail = asString(req.adminEmail || req.adminMailboxEmail).toLowerCase();
  const expectedEmails = uniqueLower(req.emailsToConnect || req.expectedEmails || req.emails);
  const selectedDomains = uniqueLower(req.selectedDomains || req.domains || req.domain);
  const enableWarmup = asBoolean(req.enableWarmup, true);
  const tagName = asString(req.tagName || req.namespaceId || req.correlationId);
  const incomingJobId = asString(req.jobId || req.syncJobId || req.trulyInboxSyncJobId);
  if (!adminEmail && !asString(req.workspaceId || req.trulyInboxWorkspaceId)) {
    return ensureFailure("MISSING_ADMIN_EMAIL", "adminEmail or persisted trulyInboxWorkspaceId is required", { retryable: false });
  }
  if (!expectedEmails.length && !selectedDomains.length) {
    return ensureFailure("MISSING_EXPECTED_SET", "emailsToConnect/expectedEmails or selectedDomains/domains is required", {
      retryable: false,
      adminEmail,
    });
  }
  const resolved = await resolveWorkspace(asString(req.workspaceId || req.trulyInboxWorkspaceId), adminEmail);
  if (!resolved.ok) return { ...resolved, adminEmail, expectedEmails };
  const workspaceId = asString(resolved.workspaceId);
  let preview = resolved.preview;
  if (selectedDomains.length) {
    const filtered = await previewWorkspaceMailboxes({ workspaceId, domain: selectedDomains.join(",") });
    if (!filtered.ok && asString(filtered.outcome) !== "PREVIEW_TRUNCATED") {
      return { ...filtered, workspaceId, adminEmail, expectedEmails };
    }
    preview = filtered;
  }
  if (incomingJobId) {
    const syncStatus = await getWorkspaceSyncStatus({ workspaceId, jobId: incomingJobId });
    if (asString(syncStatus.outcome) === "RATE_LIMITED") {
      return { ...syncStatus, workspaceId, adminEmail, expectedEmails, tagName };
    }
    if (asString(syncStatus.outcome) === "SYNC_FAILED") {
      return { ...syncStatus, workspaceId, adminEmail, expectedEmails, tagName };
    }
    if (asString(syncStatus.outcome) === "SYNC_PROCESSING") {
      return {
        ok: false,
        outcome: "RETRYING",
        retryable: true,
        workspaceId,
        adminEmail,
        jobId: incomingJobId,
        tagName,
        expectedEmails,
        failure: syncStatus.failure || "Sync still processing",
      };
    }
    if (asString(syncStatus.outcome) === "DELEGATION_MISSING") {
      return { ...syncStatus, workspaceId, adminEmail, expectedEmails, tagName };
    }
  }
  const proof = await proveExpectedWarmup({
    workspaceId,
    expectedEmails,
    selectedDomains,
    tagName,
    enableWarmup,
    preview,
  });
  if (proof.ok) {
    return {
      ...proof,
      workspaceId,
      adminEmail,
      tagName,
      jobId: incomingJobId,
    };
  }
  if (asString(proof.outcome) === "RATE_LIMITED" || asString(proof.outcome) === "DELEGATION_MISSING") {
    return { ...proof, workspaceId, adminEmail, tagName, jobId: incomingJobId };
  }
  if (proof.needsWarmupStart && (proof.emailAccountIdsToStart || []).length) {
    for (const emailAccountId of proof.emailAccountIdsToStart) {
      const started = await startWarmup({ emailAccountId });
      if (!started.ok) {
        return {
          ...started,
          workspaceId,
          adminEmail,
          tagName,
          expectedEmails,
          pendingWarmupEmails: proof.pendingWarmupEmails,
          missingEmails: proof.missingEmails,
        };
      }
    }
    const reproof = await proveExpectedWarmup({
      workspaceId,
      expectedEmails,
      selectedDomains,
      tagName,
      enableWarmup,
      preview,
    });
    if (reproof.ok) {
      return { ...reproof, workspaceId, adminEmail, tagName, jobId: incomingJobId };
    }
    return {
      ok: false,
      outcome: "RETRYING",
      retryable: true,
      workspaceId,
      adminEmail,
      tagName,
      jobId: incomingJobId,
      expectedEmails,
      missingEmails: reproof.missingEmails || [],
      pendingWarmupEmails: reproof.pendingWarmupEmails || proof.pendingWarmupEmails || [],
      failure: reproof.failure || "Warmup start accepted; rerun to prove warmupStatus=active or list status=warming",
    };
  }
  if (proof.needsSync) {
    if (expectedEmails.length && preview && preview.truncated) {
      const unproven = expectedEmails.filter((email) => {
        const inPreview = (preview.newEmails || []).some((row) => row.email === email);
        return !inPreview && (proof.missingEmails || []).includes(email);
      });
      if (unproven.length) {
        return ensureFailure("ACCOUNT_UNPROVEN", `Preview is truncated and these expected mailboxes are in neither list nor preview: ${unproven.join(", ")}`, {
          retryable: false,
          workspaceId,
          adminEmail,
          expectedEmails,
          missingEmails: unproven,
        });
      }
    }
    if (!expectedEmails.length && preview && preview.truncated) {
      return ensureFailure("PREVIEW_TRUNCATED", "Cannot selectAll-prove a truncated domain preview; pass emailsToConnect", {
        retryable: false,
        workspaceId,
        adminEmail,
        expectedEmails,
      });
    }
    const synced = await syncWorkspace({
      workspaceId,
      emailsToConnect: expectedEmails,
      selectedDomains,
      enableWarmup,
      tagName,
      deselect: req.deselect,
      emailAccountIdsToDelete: req.emailAccountIdsToDelete,
    });
    if (!synced.ok) {
      return { ...synced, workspaceId, adminEmail, tagName, expectedEmails, missingEmails: proof.missingEmails };
    }
    return {
      ok: false,
      outcome: "RETRYING",
      retryable: true,
      workspaceId,
      adminEmail,
      jobId: asString(synced.jobId),
      tagName,
      expectedEmails,
      missingEmails: proof.missingEmails || [],
      failure: "Sync accepted; rerun with jobId to read sync-status and prove connected warmup",
    };
  }
  if (proof.retryable) {
    return {
      ...proof,
      outcome: "RETRYING",
      workspaceId,
      adminEmail,
      tagName,
      jobId: incomingJobId,
    };
  }
  return { ...proof, workspaceId, adminEmail, tagName, jobId: incomingJobId };
}
