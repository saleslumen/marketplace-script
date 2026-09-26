/**
 * @description Update DNS settings for an account. PATCH /accounts/{account_id}/dns_settings. Body fields are zone_defaults and enforce_dns_only.
 * @param {Object} input
 * @param {string} input.account_id
 * @param {Object} [input.zone_defaults]
 * @param {boolean} [input.enforce_dns_only]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function updateAccountDnsSettings(input) {
  const req = inputObject(input);
  const accountId = requiredString(req, "account_id");
  return cloudflareRequest(`/accounts/${encodeURIComponent(accountId)}/dns_settings`, "PATCH", { body: pick(req, ["zone_defaults", "enforce_dns_only"]) });
}
