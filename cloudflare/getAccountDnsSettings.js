/**
 * @description Show DNS settings for an account. GET /accounts/{account_id}/dns_settings.
 * @param {Object} input
 * @param {string} input.account_id
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function getAccountDnsSettings(input) {
  const req = inputObject(input);
  const accountId = requiredString(req, "account_id");
  return cloudflareRequest(`/accounts/${encodeURIComponent(accountId)}/dns_settings`, "GET");
}
