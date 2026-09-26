/**
 * @description Overwrite a DNS record. PUT /zones/{zone_id}/dns_records/{dns_record_id}. name, ttl, and type are required. Other input keys are the documented record body and are sent unchanged.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {string} input.dns_record_id
 * @param {string} input.name
 * @param {number} input.ttl
 * @param {string} input.type
 * @param {boolean} [input.include_shadow_metadata]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function overwriteDnsRecord(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  const dnsRecordId = requiredString(req, "dns_record_id");
  requireDnsRecord(req);
  const path = withQuery(`/zones/${encodeURIComponent(zoneId)}/dns_records/${encodeURIComponent(dnsRecordId)}`, req, SHADOW_METADATA_QUERY);
  return cloudflareRequest(path, "PUT", { body: omit(req, DNS_RECORD_BODY_OMIT) });
}
