/**
 * @description Verify → repair → re-verify Google email DNS for the full requested domain set.
 * SUCCEEDED-shaped only when every domain is GOOGLE, cloudflare_checked, healthy, MX/SPF/DKIM/DMARC ok.
 * DKIM not_applicable/pending → RETRYING (mailboxes must be active first).
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} input.domains
 * @returns {Object}
 */
async function ensureGoogleEmailDns(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domains = asCsvList(req.domains).map((name) => name.toLowerCase());
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", retryable: false, permanent: false, failure: "workspaceId is required" };
  }
  if (!domains.length) {
    return { ok: false, outcome: "MISSING_DOMAINS", retryable: false, permanent: false, failure: "domains is required" };
  }
  const maxPasses = Math.max(1, asNumber(req.repairPasses, 2));
  let lastVerify = null;
  let repaired = false;
  for (let pass = 0; pass < maxPasses; pass += 1) {
    lastVerify = await verifyDns({ workspaceId, domains });
    if (!lastVerify.ok) {
      return {
        ok: false,
        outcome: lastVerify.outcome || "VERIFY_FAILED",
        retryable: lastVerify.retryable !== false,
        permanent: false,
        workspaceId,
        domains,
        summary: lastVerify.summary || {},
        results: lastVerify.results || [],
        failure: lastVerify.failure,
      };
    }
    const classified = classifyVerifyResults(domains, lastVerify);
    if (classified.healthy.length === domains.length && !classified.retrying.length && !classified.failed.length) {
      return {
        ok: true,
        outcome: "DNS_HEALTHY",
        retryable: false,
        permanent: false,
        workspaceId,
        domains,
        healthy: classified.healthy,
        retrying: [],
        failed: [],
        repaired,
        summary: lastVerify.summary,
        results: lastVerify.results,
        failure: "",
      };
    }
    if (classified.failed.length) {
      return {
        ok: false,
        outcome: "DNS_FAILED",
        retryable: false,
        permanent: true,
        workspaceId,
        domains,
        healthy: classified.healthy,
        retrying: classified.retrying,
        failed: classified.failed,
        repaired,
        summary: lastVerify.summary,
        results: lastVerify.results,
        failure: classified.failed.map((row) => `${row.domain}:${row.reason}`).join("; "),
      };
    }
    const needsRepairDomains = classified.retrying
      .filter((row) => row.needsRepair || ["missing", "misconfigured", "errored"].includes(row.mx) || ["missing", "misconfigured", "errored"].includes(row.spf) || ["missing", "misconfigured", "errored"].includes(row.dmarc) || ["missing", "misconfigured", "errored"].includes(row.dkim))
      .map((row) => row.domain);
    const repairTargets = needsRepairDomains.length
      ? needsRepairDomains
      : classified.retrying.filter((row) => row.needsRepair).map((row) => row.domain);
    if (!repairTargets.length || pass === maxPasses - 1) {
      return {
        ok: false,
        outcome: "RETRYING",
        retryable: true,
        permanent: false,
        workspaceId,
        domains,
        healthy: classified.healthy,
        retrying: classified.retrying,
        failed: classified.failed,
        repaired,
        summary: lastVerify.summary,
        results: lastVerify.results,
        failure: [...classified.retrying, ...classified.failed]
          .map((row) => `${row.domain}:${row.reason || row.dkim || row.overall || "pending"}`)
          .join("; "),
      };
    }
    const repairedResult = await repairDns({ workspaceId, domains: repairTargets });
    if (!repairedResult.ok) {
      return {
        ok: false,
        outcome: repairedResult.outcome === "RATE_LIMITED" ? "RATE_LIMITED" : "REPAIR_FAILED",
        retryable: repairedResult.retryable !== false,
        permanent: false,
        workspaceId,
        domains,
        healthy: classified.healthy,
        retrying: classified.retrying,
        failed: classified.failed,
        repaired,
        failure: repairedResult.failure,
      };
    }
    repaired = true;
    sleepMs(asNumber(req.reverifyDelayMs, 5000));
  }
  return {
    ok: false,
    outcome: "RETRYING",
    retryable: true,
    permanent: false,
    workspaceId,
    domains,
    repaired,
    summary: (lastVerify && lastVerify.summary) || {},
    results: (lastVerify && lastVerify.results) || [],
    failure: "DNS not healthy after repair passes",
  };
}
