/**
 * @description Register a Google Workspace for bulk connect. 422 is DELEGATION_MISSING. 409 reuses a returned workspaceId or fails closed.
 * @param {Object} input
 * @param {string} input.adminEmail - Google Workspace super-admin email.
 * @returns {Object}
 * @property {boolean} ok
 * @property {string} workspaceId
 * @property {string} outcome
 */
async function registerGoogleWorkspace(input) {
  const req = input && typeof input === "object" ? input : {};
  const adminEmail = asString(req.adminEmail || req.adminMailboxEmail).toLowerCase();
  if (!adminEmail) {
    return ensureFailure("MISSING_ADMIN_EMAIL", "adminEmail is required", { retryable: false });
  }
  const classified = classifyHttp(await trulyinboxRequestRaw("/workspaces", "POST", {
    provider: "google",
    adminEmail,
  }));
  if (classified.status === 429 || classified.retryable) {
    return ensureFailure("RATE_LIMITED", classified.message || "TrulyInbox rate limited (20 req/min)", {
      retryable: true,
      adminEmail,
    });
  }
  if (classified.status === 422) {
    return ensureFailure("DELEGATION_MISSING", classified.message || "Domain-wide delegation is missing or adminEmail is invalid", {
      retryable: false,
      human: true,
      adminEmail,
    });
  }
  if (classified.status === 409) {
    const reusedId = asString(classified.body.workspaceId);
    if (reusedId) {
      return {
        ok: true,
        outcome: "WORKSPACE_REUSED",
        workspaceId: reusedId,
        provider: asString(classified.body.provider) || "google",
        adminEmail: asString(classified.body.adminEmail || adminEmail).toLowerCase(),
        status: asString(classified.body.status) || "conflict",
        retryable: false,
        failure: "",
      };
    }
    return ensureFailure("WORKSPACE_CONFLICT", classified.message || "Workspace register conflict without a reusable workspaceId", {
      retryable: false,
      adminEmail,
    });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return ensureFailure("REGISTER_REJECTED", classified.message || `Register failed (${classified.status})`, {
      retryable: false,
      adminEmail,
    });
  }
  const workspaceId = asString(classified.body.workspaceId);
  if (!workspaceId) {
    return ensureFailure("REGISTER_UNPROVEN", "Register response omitted workspaceId", { retryable: false, adminEmail });
  }
  return {
    ok: true,
    outcome: "WORKSPACE_CREATED",
    workspaceId,
    provider: asString(classified.body.provider) || "google",
    adminEmail: asString(classified.body.adminEmail || adminEmail).toLowerCase(),
    status: asString(classified.body.status) || "created",
    retryable: false,
    failure: "",
  };
}
