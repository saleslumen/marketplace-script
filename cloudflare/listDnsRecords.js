/**
 * @description List, search, sort, and filter a zone's DNS records. GET /zones/{zone_id}/dns_records. Nested filters use the documented objects and are sent as dotted query keys, for example name.exact.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {Object} [input.comment]
 * @param {Object} [input.content]
 * @param {"asc"|"desc"} [input.direction]
 * @param {boolean} [input.include_shadow_metadata]
 * @param {"any"|"all"} [input.match]
 * @param {Object} [input.name]
 * @param {"type"|"name"|"content"|"ttl"|"proxied"} [input.order]
 * @param {number} [input.page]
 * @param {number} [input.per_page]
 * @param {boolean} [input.proxied]
 * @param {string} [input.search]
 * @param {string} [input.shadowed_by_name]
 * @param {string} [input.shadowing_name]
 * @param {Object} [input.tag]
 * @param {"any"|"all"} [input.tag_match]
 * @param {string} [input.type]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function listDnsRecords(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  return cloudflareRequest(withQuery(`/zones/${encodeURIComponent(zoneId)}/dns_records`, req, LIST_DNS_RECORD_QUERY), "GET");
}
