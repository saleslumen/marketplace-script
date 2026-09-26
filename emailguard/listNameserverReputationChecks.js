/**
 * @description List Nameserver Reputation Checks. GET /api/v1/spamhaus-intelligence/nameserver-reputation.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listNameserverReputationChecks() {
  return emailguardRequest("/api/v1/spamhaus-intelligence/nameserver-reputation", "GET");
}
