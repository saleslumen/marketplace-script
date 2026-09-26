/**
 * @description Edit multiple zone settings. PATCH /zones/{zone_id}/settings. items is the documented body array of setting objects.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {Object[]} input.items
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function editMultipleZoneSettings(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  requiredArray(req, "items");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/settings`, "PATCH", { body: pick(req, ["items"]) });
}
