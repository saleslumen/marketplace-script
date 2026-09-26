/**
 * @description Create an internal DNS view. POST /accounts/{account_id}/dns_settings/views. name and zones are required.
 * @param {Object} input
 * @param {string} input.account_id
 * @param {string} input.name
 * @param {string[]} input.zones
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function createInternalDnsView(input) {
  const req = inputObject(input);
  const accountId = requiredString(req, "account_id");
  requiredString(req, "name");
  requiredArray(req, "zones");
  return cloudflareRequest(`/accounts/${encodeURIComponent(accountId)}/dns_settings/views`, "POST", { body: pick(req, ["name", "zones"]) });
}
