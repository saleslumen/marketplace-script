/**
 * @description DNS record details. GET /zones/{zone_id}/dns_records/{dns_record_id}.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {string} input.dns_record_id
 * @param {boolean} [input.include_shadow_metadata]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function getDnsRecord(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  const dnsRecordId = requiredString(req, "dns_record_id");
  const path = withQuery(`/zones/${encodeURIComponent(zoneId)}/dns_records/${encodeURIComponent(dnsRecordId)}`, req, SHADOW_METADATA_QUERY);
  return cloudflareRequest(path, "GET");
}
