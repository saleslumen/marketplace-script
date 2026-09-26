/**
 * @description Edit one zone setting. PATCH /zones/{zone_id}/settings/{setting_id}. The body is value or enabled, matching the documented setting shape. cname_flattening uses value.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {string} input.setting_id
 * @param {*} [input.value]
 * @param {boolean} [input.enabled]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function editZoneSetting(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  const settingId = requiredString(req, "setting_id");
  if (!present(req, "value") && !present(req, "enabled")) throw new Error("CLOUDFLARE_INVALID_INPUT: value or enabled is required");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/settings/${encodeURIComponent(settingId)}`, "PATCH", { body: pick(req, ["value", "enabled"]) });
}
