/**
 * @description List Domain Reputation Checks. GET /api/v1/spamhaus-intelligence/domain-reputation.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listDomainReputationChecks() {
  return emailguardRequest("/api/v1/spamhaus-intelligence/domain-reputation", "GET");
}
