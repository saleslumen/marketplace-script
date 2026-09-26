/**
 * @description Show A Record Reputation Check. GET /api/v1/spamhaus-intelligence/a-record-reputation/{spamhausARecordReputationCheck_uuid}.
 * @param {Object} input
 * @param {string} input.spamhausARecordReputationCheck_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: spamhausARecordReputationCheck_uuid is required when spamhausARecordReputationCheck_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function showARecordReputationCheck(input) {
  const req = inputObject(input);
  const spamhausARecordReputationCheck_uuid = requireText(req, "spamhausARecordReputationCheck_uuid");
  return emailguardRequest(`/api/v1/spamhaus-intelligence/a-record-reputation/${encodeURIComponent(spamhausARecordReputationCheck_uuid)}`, "GET");
}
