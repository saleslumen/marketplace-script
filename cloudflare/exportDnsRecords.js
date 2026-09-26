/**
 * @description Export DNS records as a BIND zone file. GET /zones/{zone_id}/dns_records/export. The return value is the response body text.
 * @param {Object} input
 * @param {string} input.zone_id
 * @returns {string} BIND zone file
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function exportDnsRecords(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/dns_records/export`, "GET", { accept: "text/plain", raw: true });
}
