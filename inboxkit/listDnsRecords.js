/**
 * @description List DNS records for one domain via InboxKit inventory.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} [input.domain]
 * @param {string} [input.uid]
 * @returns {Object}
 */
async function listDnsRecords(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domain = asString(req.domain || req.name).toLowerCase();
  const uid = asString(req.uid || req.domainUid);
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", records: [], failure: "workspaceId is required" };
  }
  if (!domain && !uid) {
    return { ok: false, outcome: "MISSING_DOMAIN", records: [], failure: "domain or uid is required" };
  }
  const query = domain ? `domain=${encodeURIComponent(domain)}` : `uid=${encodeURIComponent(uid)}`;
  const response = await inboxKitRequest(`/v1/api/dns/list?${query}`, "GET", undefined, workspaceId);
  if (response.error) {
    return { ok: false, outcome: "LIST_FAILED", records: [], failure: asString(response.message) || "dns list failed" };
  }
  const dnsRecord = response.dns_record || response.data || {};
  const records = Array.isArray(dnsRecord.records) ? dnsRecord.records : (Array.isArray(response.records) ? response.records : []);
  return {
    ok: true,
    outcome: "LISTED",
    workspaceId,
    domain: asString(dnsRecord.domain || domain),
    uid: asString(dnsRecord.uid || uid),
    records,
    count: records.length,
    failure: "",
  };
}
