/**
 * @description Update DNS settings for a zone. PATCH /zones/{zone_id}/dns_settings. Only provided documented fields are sent.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {boolean} [input.flatten_all_cnames]
 * @param {boolean} [input.foundation_dns]
 * @param {Object} [input.internal_dns]
 * @param {boolean} [input.multi_provider]
 * @param {Object} [input.nameservers]
 * @param {number} [input.ns_ttl]
 * @param {boolean} [input.secondary_overrides]
 * @param {Object} [input.soa]
 * @param {"standard"|"cdn_only"|"dns_only"} [input.zone_mode]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function updateZoneDnsSettings(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  const fields = ["flatten_all_cnames", "foundation_dns", "internal_dns", "multi_provider", "nameservers", "ns_ttl", "secondary_overrides", "soa", "zone_mode"];
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/dns_settings`, "PATCH", { body: pick(req, fields) });
}
