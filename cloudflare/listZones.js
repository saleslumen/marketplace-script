/**
 * @description List, search, sort, and filter zones. GET /zones.
 * @param {Object} input
 * @param {Object} [input.account]
 * @param {string} [input.account.id]
 * @param {string} [input.account.name]
 * @param {"asc"|"desc"} [input.direction]
 * @param {"any"|"all"} [input.match]
 * @param {string} [input.name]
 * @param {"name"|"status"|"account.id"|"account.name"|"plan.id"} [input.order]
 * @param {number} [input.page]
 * @param {number} [input.per_page]
 * @param {"initializing"|"pending"|"active"|"moved"} [input.status]
 * @param {string|string[]} [input.type] Comma-separated zone types, or an array joined as a comma-separated list
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function listZones(input) {
  const req = inputObject(input);
  return cloudflareRequest(withQuery("/zones", req, LIST_ZONE_QUERY), "GET");
}
