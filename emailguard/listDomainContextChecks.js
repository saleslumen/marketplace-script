/**
 * @description List Domain Context Checks. GET /api/v1/spamhaus-intelligence/domain-contexts.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listDomainContextChecks() {
  return emailguardRequest("/api/v1/spamhaus-intelligence/domain-contexts", "GET");
}
