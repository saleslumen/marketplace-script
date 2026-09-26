/**
 * @description Batch DNS records. POST /zones/{zone_id}/dns_records/batch. deletes, patches, posts, and puts are the documented body arrays.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {boolean} [input.include_shadow_metadata]
 * @param {Object[]} [input.deletes]
 * @param {Object[]} [input.patches]
 * @param {Object[]} [input.posts]
 * @param {Object[]} [input.puts]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function batchDnsRecords(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  const path = withQuery(`/zones/${encodeURIComponent(zoneId)}/dns_records/batch`, req, SHADOW_METADATA_QUERY);
  return cloudflareRequest(path, "POST", { body: pick(req, ["deletes", "patches", "posts", "puts"]) });
}
