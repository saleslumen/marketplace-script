/**
 * @description Review scanned DNS records. POST /zones/{zone_id}/dns_records/scan/review. accepts and rejects are the documented body arrays.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {Object[]} [input.accepts]
 * @param {Object[]} [input.rejects]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function reviewScannedDnsRecords(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/dns_records/scan/review`, "POST", { body: pick(req, ["accepts", "rejects"]) });
}
