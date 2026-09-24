/**
 * @description Export DNS records for a zone (BIND-style text) for client handoff.
 * @param {Object} input
 * @param {string} input.zoneId
 * @param {string} input.accountId
 * @returns {Object}
 * @property {string} zoneId
 * @property {string} bind
 */
async function exportDns(input) {
  const zoneId = asString(input && input.zoneId);
  const accountId = asString(input && (input.accountId || input.cloudflareAccountId));
  if (!zoneId) throw new Error("CLOUDFLARE_REQUEST_FAILED: zoneId is required");
  if (!accountId) throw new Error("CLOUDFLARE_ACCOUNT_ID_MISSING: accountId is required");
  const token = await getCloudflareApiToken(accountId);
  const response = await UrlFetchApp.fetch(
    `${CLOUDFLARE_API_BASE}/zones/${encodeURIComponent(zoneId)}/dns_records/export`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "text/plain" },
    },
  );
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`CLOUDFLARE_REQUEST_FAILED (${status}): ${text}`);
  return { zoneId, accountId, bind: text };
}
