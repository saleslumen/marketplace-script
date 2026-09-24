/**
 * @description Idempotent ensure: list connected, connect only missing names, treat already_connected as success.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} input.domains
 * @returns {Object}
 */
async function ensureCloudflareDomainsConnected(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domains = asCsvList(req.domains).map((name) => name.toLowerCase());
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", retryable: false, permanent: false, domains: [], failure: "workspaceId is required" };
  }
  if (!domains.length) {
    return { ok: false, outcome: "MISSING_DOMAINS", retryable: false, permanent: false, domains: [], failure: "domains is required" };
  }
  let listed;
  try {
    listed = await listConnectedCloudflareDomains({ workspaceId, allPages: true });
  } catch (error) {
    return {
      ok: false,
      outcome: "LIST_FAILED",
      retryable: true,
      permanent: false,
      workspaceId,
      domains: [],
      failure: asString(error && error.message) || "list connected domains failed",
    };
  }
  if (!listed.ok) {
    return {
      ok: false,
      outcome: listed.outcome || "LIST_FAILED",
      retryable: true,
      permanent: false,
      workspaceId,
      domains: listed.domains || [],
      failure: listed.failure,
    };
  }
  const connectedNames = new Set((listed.domains || []).map((row) => asString(row.name).toLowerCase()).filter(Boolean));
  const missing = domains.filter((name) => !connectedNames.has(name));
  if (!missing.length) {
    const ready = (listed.domains || []).filter((row) => domains.includes(asString(row.name).toLowerCase()));
    return {
      ok: true,
      outcome: "ALREADY_CONNECTED",
      retryable: false,
      permanent: false,
      workspaceId,
      domains: ready,
      connected: ready,
      missing: [],
      conflicts: [],
      failure: "",
    };
  }
  const connected = await connectCloudflareDomains({
    workspaceId,
    domains: missing,
    validateDNS: req.validateDNS === undefined ? true : req.validateDNS,
    label: req.label || `workspace-${workspaceId}`,
  });
  if (asString(connected.outcome) === "DNS_CONFLICTS") {
    return {
      ok: false,
      outcome: "DNS_CONFLICTS",
      retryable: true,
      permanent: false,
      workspaceId,
      domains: connected.connected || [],
      connected: connected.connected || [],
      missing,
      conflicts: connected.conflicts || [],
      failed: connected.failed || [],
      failure: connected.failure,
    };
  }
  if (connected.permanent || ["ACCOUNT_ALREADY_USED", "CREDENTIAL_CONFLICT", "MISSING_CLOUDFLARE_TOKEN"].includes(asString(connected.outcome))) {
    return {
      ok: false,
      outcome: connected.outcome,
      retryable: false,
      permanent: true,
      workspaceId,
      domains: connected.connected || [],
      connected: connected.connected || [],
      missing,
      conflicts: [],
      failure: connected.failure,
    };
  }
  if (asString(connected.outcome) === "RATE_LIMITED") {
    return {
      ok: false,
      outcome: "RATE_LIMITED",
      retryable: true,
      permanent: false,
      workspaceId,
      domains: connected.connected || [],
      connected: connected.connected || [],
      missing,
      conflicts: [],
      failure: connected.failure,
    };
  }
  if (!connected.ok) {
    return {
      ok: false,
      outcome: connected.outcome || "CONNECT_INCOMPLETE",
      retryable: connected.retryable !== false,
      permanent: false,
      workspaceId,
      domains: connected.connected || [],
      connected: connected.connected || [],
      missing: connected.missing || missing,
      conflicts: connected.conflicts || [],
      failed: connected.failed || [],
      failure: connected.failure,
    };
  }
  const relisted = await listConnectedCloudflareDomains({ workspaceId, allPages: true });
  const after = relisted.ok ? (relisted.domains || []) : (connected.connected || []);
  const covered = new Set(after.map((row) => asString(row.name).toLowerCase()));
  const stillMissing = domains.filter((name) => !covered.has(name));
  const ready = after.filter((row) => domains.includes(asString(row.name).toLowerCase()));
  if (stillMissing.length) {
    return {
      ok: false,
      outcome: "CONNECT_INCOMPLETE",
      retryable: true,
      permanent: false,
      workspaceId,
      domains: ready,
      connected: ready,
      missing: stillMissing,
      conflicts: [],
      failure: `Not connected: ${stillMissing.join(", ")}`,
    };
  }
  return {
    ok: true,
    outcome: "CONNECTED",
    retryable: false,
    permanent: false,
    workspaceId,
    domains: ready,
    connected: ready,
    missing: [],
    conflicts: [],
    failure: "",
  };
}
