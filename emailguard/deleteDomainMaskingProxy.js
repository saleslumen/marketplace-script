/**
 * @description Delete Domain Masking Proxy. DELETE /api/v1/domain-masking-proxies/{hosted_domain_redirect_uuid}.
 * @param {Object} input
 * @param {string} input.hosted_domain_redirect_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: hosted_domain_redirect_uuid is required when hosted_domain_redirect_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function deleteDomainMaskingProxy(input) {
  const req = inputObject(input);
  const hosted_domain_redirect_uuid = requireText(req, "hosted_domain_redirect_uuid");
  return emailguardRequest(`/api/v1/domain-masking-proxies/${encodeURIComponent(hosted_domain_redirect_uuid)}`, "DELETE");
}
