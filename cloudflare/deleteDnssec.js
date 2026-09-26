/**
 * @description Delete DNSSEC records. DELETE /zones/{zone_id}/dnssec.
 * @param {Object} input
 * @param {string} input.zone_id
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function deleteDnssec(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/dnssec`, "DELETE");
}
