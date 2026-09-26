/**
 * @description Update an internal DNS view. PATCH /accounts/{account_id}/dns_settings/views/{view_id}. Body fields are name and zones.
 * @param {Object} input
 * @param {string} input.account_id
 * @param {string} input.view_id
 * @param {string} [input.name]
 * @param {string[]} [input.zones]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function updateInternalDnsView(input) {
  const req = inputObject(input);
  const accountId = requiredString(req, "account_id");
  const viewId = requiredString(req, "view_id");
  return cloudflareRequest(`/accounts/${encodeURIComponent(accountId)}/dns_settings/views/${encodeURIComponent(viewId)}`, "PATCH", { body: pick(req, ["name", "zones"]) });
}
