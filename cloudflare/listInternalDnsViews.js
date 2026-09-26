/**
 * @description List internal DNS views. GET /accounts/{account_id}/dns_settings/views.
 * @param {Object} input
 * @param {string} input.account_id
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function listInternalDnsViews(input) {
  const req = inputObject(input);
  const accountId = requiredString(req, "account_id");
  return cloudflareRequest(`/accounts/${encodeURIComponent(accountId)}/dns_settings/views`, "GET");
}
