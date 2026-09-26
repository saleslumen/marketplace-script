/**
 * @description IP of Hosted Domain Redirect. GET /api/v1/hosted-domain-redirects/ip.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function ipOfHostedDomainRedirect() {
  return emailguardRequest("/api/v1/hosted-domain-redirects/ip", "GET");
}
