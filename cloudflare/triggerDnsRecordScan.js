/**
 * @description Trigger a DNS record scan. POST /zones/{zone_id}/dns_records/scan/trigger. The scan does not add records until they are reviewed.
 * @param {Object} input
 * @param {string} input.zone_id
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function triggerDnsRecordScan(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/dns_records/scan/trigger`, "POST");
}
