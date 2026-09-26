/**
 * @description Show Domain Context Check. GET /api/v1/spamhaus-intelligence/domain-contexts/{spamhausDomainContextCheck_uuid}.
 * @param {Object} input
 * @param {string} input.spamhausDomainContextCheck_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: spamhausDomainContextCheck_uuid is required when spamhausDomainContextCheck_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function showDomainContextCheck(input) {
  const req = inputObject(input);
  const spamhausDomainContextCheck_uuid = requireText(req, "spamhausDomainContextCheck_uuid");
  return emailguardRequest(`/api/v1/spamhaus-intelligence/domain-contexts/${encodeURIComponent(spamhausDomainContextCheck_uuid)}`, "GET");
}
