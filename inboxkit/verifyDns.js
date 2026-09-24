/**
 * @description Verify Google/Microsoft email DNS for one or more domains (read-only).
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} [input.domains]
 * @param {string} [input.domain]
 * @returns {Object}
 */
async function verifyDns(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domains = asCsvList(req.domains || req.domain).map((name) => name.toLowerCase());
  const uids = asCsvList(req.uids || req.uid);
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", results: [], failure: "workspaceId is required" };
  }
  if (!domains.length && !uids.length) {
    return { ok: false, outcome: "MISSING_DOMAINS", results: [], failure: "domains or uids is required" };
  }
  const body = {};
  if (domains.length === 1 && !uids.length) body.domain = domains[0];
  else if (domains.length) body.domains = domains;
  if (uids.length === 1 && !domains.length) body.uid = uids[0];
  else if (uids.length) body.uids = uids;
  const raw = await inboxKitRequestRaw("/v1/api/dns/verify", "POST", body, workspaceId);
  const response = raw.body || {};
  if (raw.status === 429) {
    return {
      ok: false,
      outcome: "RATE_LIMITED",
      retryable: true,
      results: [],
      failure: asString(response.message) || "DNS verify rate limited",
    };
  }
  if (raw.status < 200 || raw.status >= 300 || response.error === true) {
    return {
      ok: false,
      outcome: "VERIFY_FAILED",
      retryable: raw.status >= 500,
      results: [],
      failure: asString(response.message) || `verify failed (${raw.status})`,
    };
  }
  const summary = response.summary || {};
  const results = Array.isArray(response.results) ? response.results : [];
  return {
    ok: true,
    outcome: "VERIFIED",
    workspaceId,
    summary: {
      totalRequested: Number(summary.total_requested || 0) || 0,
      totalVerified: Number(summary.total_verified || 0) || 0,
      totalFailed: Number(summary.total_failed || 0) || 0,
      healthy: Number(summary.healthy || 0) || 0,
      critical: Number(summary.critical || 0) || 0,
      issuesFound: Number(summary.issues_found || 0) || 0,
      needsRepair: Number(summary.needs_repair || 0) || 0,
    },
    results,
    failure: "",
  };
}
