/**
 * @description Delete an internal DNS view. DELETE /accounts/{account_id}/dns_settings/views/{view_id}.
 * @param {Object} input
 * @param {string} input.account_id
 * @param {string} input.view_id
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function deleteInternalDnsView(input) {
  const req = inputObject(input);
  const accountId = requiredString(req, "account_id");
  const viewId = requiredString(req, "view_id");
  return cloudflareRequest(`/accounts/${encodeURIComponent(accountId)}/dns_settings/views/${encodeURIComponent(viewId)}`, "DELETE");
}
