/**
 * @description Repair email DNS via InboxKit (primary Google MX/SPF/DKIM/DMARC writer; syncs to Cloudflare).
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} [input.domains]
 * @returns {Object}
 */
async function repairDns(input) {
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
  const raw = await inboxKitRequestRaw("/v1/api/dns/repair", "POST", body, workspaceId);
  const response = raw.body || {};
  if (raw.status === 429) {
    return {
      ok: false,
      outcome: "RATE_LIMITED",
      retryable: true,
      results: [],
      failure: asString(response.message) || "DNS repair rate limited",
    };
  }
  if (raw.status < 200 || raw.status >= 300 || response.error === true) {
    return {
      ok: false,
      outcome: "REPAIR_FAILED",
      retryable: raw.status >= 500,
      results: [],
      failure: asString(response.message) || `repair failed (${raw.status})`,
    };
  }
  return {
    ok: true,
    outcome: "REPAIRED",
    workspaceId,
    summary: response.summary || {},
    results: Array.isArray(response.results) ? response.results : [],
    failure: "",
  };
}
