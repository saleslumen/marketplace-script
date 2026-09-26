/**
 * @description List Domain Sender Checks. GET /api/v1/spamhaus-intelligence/domain-senders.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listDomainSenderChecks() {
  return emailguardRequest("/api/v1/spamhaus-intelligence/domain-senders", "GET");
}
