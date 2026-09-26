/**
 * @description Get one zone setting. GET /zones/{zone_id}/settings/{setting_id}. The DNS-relevant setting id is cname_flattening.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {string} input.setting_id
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function getZoneSetting(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  const settingId = requiredString(req, "setting_id");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/settings/${encodeURIComponent(settingId)}`, "GET");
}
