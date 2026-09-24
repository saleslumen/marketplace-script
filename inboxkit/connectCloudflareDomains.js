/**
 * @description Connect domains in InboxKit with the Cloudflare API token connection. Never returns the token.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} input.domains
 * @param {boolean|string} [input.validateDNS]
 * @param {string} [input.label]
 * @returns {Object}
 */
async function connectCloudflareDomains(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domains = asCsvList(req.domains).map((name) => name.toLowerCase());
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", retryable: false, failure: "workspaceId is required" };
  }
  if (!domains.length && !asBoolean(req.connectAll, false)) {
    return { ok: false, outcome: "MISSING_DOMAINS", retryable: false, failure: "domains is required" };
  }
  let apiToken = "";
  try {
    apiToken = await getWorkspaceCloudflareApiToken(workspaceId);
  } catch (error) {
    return {
      ok: false,
      outcome: "MISSING_CLOUDFLARE_TOKEN",
      retryable: false,
      failure: asString(error && error.message) || "Cloudflare token missing for workspace",
    };
  }
  const body = {
    auth_type: "api_token",
    api_token: apiToken,
    validateDNS: asBoolean(req.validateDNS, true),
  };
  if (asString(req.label)) body.label = asString(req.label);
  if (asBoolean(req.connectAll, false)) body.connect_all = true;
  else body.domains = domains;
  const raw = await inboxKitRequestRaw("/v1/api/cloudflare-domains/connect", "POST", body, workspaceId);
  const response = raw.body || {};
  if (raw.status === 429) {
    return {
      ok: false,
      outcome: "RATE_LIMITED",
      retryable: true,
      workspaceId,
      failure: asString(response.message) || "Cloudflare connect rate limited (10/5min)",
    };
  }
  if (raw.status === 409) {
    const code = asString(response.code).toUpperCase() || "ACCOUNT_ALREADY_USED";
    return {
      ok: false,
      outcome: code === "CREDENTIAL_CONFLICT" ? "CREDENTIAL_CONFLICT" : "ACCOUNT_ALREADY_USED",
      retryable: false,
      permanent: true,
      workspaceId,
      failure: asString(response.message) || code,
    };
  }
  if (raw.status < 200 || raw.status >= 300 || response.error === true) {
    return {
      ok: false,
      outcome: "CONNECT_FAILED",
      retryable: raw.status >= 500 || raw.status === 0,
      workspaceId,
      failure: asString(response.message) || `connect failed (${raw.status})`,
    };
  }
  const results = Array.isArray(response.results) ? response.results : [];
  const conflicts = results
    .filter((row) => row && row.dns_conflict && (row.dns_conflict.has_conflict === true || Array.isArray(row.dns_conflict.records)))
    .map((row) => ({
      domain: asString(row.zone_name).toLowerCase(),
      zone_name: asString(row.zone_name).toLowerCase(),
      success: row.success === true,
      error: asString(row.error),
      records: Array.isArray(row.dns_conflict.records)
        ? row.dns_conflict.records.map((item) => ({
          type: asString(item.type).toUpperCase(),
          host: asString(item.host || item.name),
        }))
        : [],
      labels: Array.isArray(row.dns_conflict.labels) ? row.dns_conflict.labels.map(asString) : [],
      message: asString(row.dns_conflict.message),
    }));
  const failed = results
    .filter((row) => row && row.success === false)
    .map((row) => ({
      domain: asString(row.zone_name).toLowerCase(),
      error: asString(row.error),
      hasConflict: Boolean(row.dns_conflict && row.dns_conflict.has_conflict),
    }));
  const connected = (response.domains || []).map((row) => ({
    uid: asString(row.uid),
    name: asString(row.name).toLowerCase(),
    status: asString(row.status),
    reconnected: row.reconnected === true,
  }));
  const skipped = (response.skipped || []).map((row) => ({
    name: asString(row.name).toLowerCase(),
    reason: asString(row.reason),
    domainUid: asString(row.domain_uid),
  }));
  if (conflicts.length) {
    return {
      ok: false,
      outcome: "DNS_CONFLICTS",
      retryable: true,
      workspaceId,
      connected,
      skipped,
      conflicts,
      failed,
      connectedCount: Number(response.connected_count || connected.length) || connected.length,
      failedCount: Number(response.failed_count || failed.length) || failed.length,
      skippedCount: Number(response.skipped_count || skipped.length) || skipped.length,
      failure: conflicts.map((row) => `${row.domain}:${row.message || "dns_conflict"}`).join("; "),
    };
  }
  const requested = domains.length ? domains : connected.map((row) => row.name);
  const covered = new Set([
    ...connected.map((row) => row.name),
    ...skipped.filter((row) => ["already_connected", "already_exists"].includes(row.reason)).map((row) => row.name),
  ]);
  const missing = requested.filter((name) => !covered.has(name));
  const hardFailed = failed.filter((row) => !row.hasConflict);
  const ok = hardFailed.length === 0 && missing.length === 0 && Number(response.failed_count || 0) === 0;
  return {
    ok,
    outcome: ok ? "CONNECTED" : "CONNECT_INCOMPLETE",
    retryable: !ok,
    workspaceId,
    connected,
    skipped,
    conflicts: [],
    failed: hardFailed,
    missing,
    connectedCount: Number(response.connected_count || connected.length) || connected.length,
    reconnectedCount: Number(response.reconnected_count || 0) || 0,
    failedCount: Number(response.failed_count || hardFailed.length) || hardFailed.length,
    skippedCount: Number(response.skipped_count || skipped.length) || skipped.length,
    failure: ok
      ? ""
      : [...hardFailed.map((row) => `${row.domain}:${row.error || "failed"}`), ...missing.map((name) => `${name}:not_connected`)].join("; "),
  };
}
