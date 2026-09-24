/**
 * @description Register a Microsoft tenant workspace after admin consent. 422 is CONSENT_MISSING. 409 reuses a returned workspaceId or fails closed.
 * @param {Object} input
 * @param {string} input.tenantId
 * @returns {Object}
 */
async function registerMicrosoftWorkspace(input) {
  const req = input && typeof input === "object" ? input : {};
  const tenantId = asString(req.tenantId);
  if (!tenantId) {
    return { ok: false, outcome: "MISSING_TENANT_ID", retryable: false, failure: "tenantId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw("/workspaces", "POST", {
    provider: "microsoft",
    tenantId,
  }));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { tenantId });
  }
  if (classified.status === 422) {
    return {
      ok: false,
      outcome: "CONSENT_MISSING",
      retryable: false,
      human: true,
      tenantId,
      failure: classified.message || "Microsoft admin consent is missing or tenantId is invalid",
    };
  }
  if (classified.status === 409) {
    const reusedId = asString(classified.body.workspaceId);
    if (reusedId) {
      return {
        ok: true,
        outcome: "WORKSPACE_REUSED",
        workspaceId: reusedId,
        provider: asString(classified.body.provider) || "microsoft",
        tenantId: asString(classified.body.tenantId || tenantId),
        adminEmail: asString(classified.body.adminEmail),
        status: asString(classified.body.status) || "conflict",
        retryable: false,
        failure: "",
      };
    }
    return {
      ok: false,
      outcome: "WORKSPACE_CONFLICT",
      retryable: false,
      tenantId,
      failure: classified.message || "Workspace register conflict without a reusable workspaceId",
    };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "REGISTER_REJECTED",
      retryable: false,
      tenantId,
      failure: classified.message || `Register failed (${classified.status})`,
    };
  }
  const workspaceId = asString(classified.body.workspaceId);
  if (!workspaceId) {
    return { ok: false, outcome: "REGISTER_UNPROVEN", retryable: false, tenantId, failure: "Register response omitted workspaceId" };
  }
  return {
    ok: true,
    outcome: "WORKSPACE_CREATED",
    workspaceId,
    provider: asString(classified.body.provider) || "microsoft",
    tenantId: asString(classified.body.tenantId || tenantId),
    adminEmail: asString(classified.body.adminEmail),
    status: asString(classified.body.status) || "created",
    retryable: false,
    failure: "",
  };
}
