/**
 * @description Show Domain Reputation Check. GET /api/v1/spamhaus-intelligence/domain-reputation/{spamhausDomainReputationCheck_uuid}.
 * @param {Object} input
 * @param {string} input.spamhausDomainReputationCheck_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: spamhausDomainReputationCheck_uuid is required when spamhausDomainReputationCheck_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function showDomainReputationCheck(input) {
  const req = inputObject(input);
  const spamhausDomainReputationCheck_uuid = requireText(req, "spamhausDomainReputationCheck_uuid");
  return emailguardRequest(`/api/v1/spamhaus-intelligence/domain-reputation/${encodeURIComponent(spamhausDomainReputationCheck_uuid)}`, "GET");
}
