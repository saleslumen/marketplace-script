/**
 * @description Show Nameserver Reputation Check. GET /api/v1/spamhaus-intelligence/nameserver-reputation/{spamhausNsReputationCheck_uuid}.
 * @param {Object} input
 * @param {string} input.spamhausNsReputationCheck_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: spamhausNsReputationCheck_uuid is required when spamhausNsReputationCheck_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function showNameserverReputationCheck(input) {
  const req = inputObject(input);
  const spamhausNsReputationCheck_uuid = requireText(req, "spamhausNsReputationCheck_uuid");
  return emailguardRequest(`/api/v1/spamhaus-intelligence/nameserver-reputation/${encodeURIComponent(spamhausNsReputationCheck_uuid)}`, "GET");
}
