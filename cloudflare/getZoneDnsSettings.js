/**
 * @description Show DNS settings for a zone. GET /zones/{zone_id}/dns_settings.
 * @param {Object} input
 * @param {string} input.zone_id
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function getZoneDnsSettings(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/dns_settings`, "GET");
}
