/**
 * @description List Hosted Domain Redirects. GET /api/v1/hosted-domain-redirects.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listHostedDomainRedirects() {
  return emailguardRequest("/api/v1/hosted-domain-redirects", "GET");
}
