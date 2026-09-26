/**
 * @description List A Record Reputation Checks. GET /api/v1/spamhaus-intelligence/a-record-reputation.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listARecordReputationChecks() {
  return emailguardRequest("/api/v1/spamhaus-intelligence/a-record-reputation", "GET");
}
