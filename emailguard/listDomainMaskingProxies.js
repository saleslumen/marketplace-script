/**
 * @description List Domain Masking Proxies. GET /api/v1/domain-masking-proxies.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listDomainMaskingProxies() {
  return emailguardRequest("/api/v1/domain-masking-proxies", "GET");
}
