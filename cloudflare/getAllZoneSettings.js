/**
 * @description Get all zone settings. GET /zones/{zone_id}/settings. The DNS-relevant setting id on this surface is cname_flattening. Cloudflare documents that setting as deprecated in favor of flatten_all_cnames on DNS settings.
 * @param {Object} input
 * @param {string} input.zone_id
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function getAllZoneSettings(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/settings`, "GET");
}
