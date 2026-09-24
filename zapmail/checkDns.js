/**
 * @description Check Zapmail-reported MX/SPF/DKIM/DMARC for domain IDs.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} input.domainIds
 * @returns {Object}
 */
async function checkDns(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domainIds = asCsvList(req.domainIds);
  if (!workspaceId) throw new Error("ZAPMAIL_REQUEST_FAILED: workspaceId is required");
  if (!domainIds.length) throw new Error("ZAPMAIL_REQUEST_FAILED: domainIds is required");
  const response = await zapmailRequest("/v2/domains/dns/check", "POST", { domainIds }, workspaceId);
  const payload = response.data;
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload && payload.domains)
      ? payload.domains
      : [];
  return {
    domains: rows.map((row) => ({
      domainId: asString(row.id),
      domainName: asString(row.domain).toLowerCase(),
      mx: row.mxRecords === true,
      spf: row.spfRecord === true,
      dkim: row.dkimRecords === true,
      dmarc: row.dmarcRecords === true,
      healthy: row.mxRecords === true && row.spfRecord === true && row.dkimRecords === true && row.dmarcRecords === true,
    })),
  };
}
