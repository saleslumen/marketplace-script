/**
 * @description Edit a zone. PATCH /zones/{zone_id}. Body fields are paused, type, and vanity_name_servers. Only provided fields are sent.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {boolean} [input.paused]
 * @param {"full"|"partial"|"secondary"|"internal"} [input.type]
 * @param {string[]} [input.vanity_name_servers]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function editZone(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}`, "PATCH", { body: pick(req, ["paused", "type", "vanity_name_servers"]) });
}
