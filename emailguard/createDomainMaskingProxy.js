/**
 * @description Create Domain Masking Proxy. POST /api/v1/domain-masking-proxies.
 * @param {Object} input
 * @param {string} input.masking_domain
 * @param {string} input.primary_domain
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: masking_domain is required when masking_domain is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: primary_domain is required when primary_domain is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function createDomainMaskingProxy(input) {
  const req = inputObject(input);
  const body = {};
  body.masking_domain = requireText(req, "masking_domain");
  body.primary_domain = requireText(req, "primary_domain");
  return emailguardRequest("/api/v1/domain-masking-proxies", "POST", body);
}
