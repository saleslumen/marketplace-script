/**
 * @description Create A Record Reputation Check. POST /api/v1/spamhaus-intelligence/a-record-reputation/create.
 * @param {Object} input
 * @param {string} input.domain
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain is required when domain is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function createARecordReputationCheck(input) {
  const req = inputObject(input);
  const body = {};
  body.domain = requireText(req, "domain");
  return emailguardRequest("/api/v1/spamhaus-intelligence/a-record-reputation/create", "POST", body);
}
