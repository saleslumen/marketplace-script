/**
 * @description Edit DNSSEC status. PATCH /zones/{zone_id}/dnssec. Body fields are dnssec_multi_signer, dnssec_presigned, dnssec_use_nsec3, and status.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {boolean} [input.dnssec_multi_signer]
 * @param {boolean} [input.dnssec_presigned]
 * @param {boolean} [input.dnssec_use_nsec3]
 * @param {"active"|"disabled"} [input.status]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function editDnssec(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/dnssec`, "PATCH", { body: pick(req, ["dnssec_multi_signer", "dnssec_presigned", "dnssec_use_nsec3", "status"]) });
}
