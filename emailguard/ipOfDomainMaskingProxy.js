/**
 * @description IP of Domain Masking Proxy. GET /api/v1/domain-masking-proxies/ip.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function ipOfDomainMaskingProxy() {
  return emailguardRequest("/api/v1/domain-masking-proxies/ip", "GET");
}
