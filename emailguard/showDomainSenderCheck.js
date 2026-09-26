/**
 * @description Show Domain Sender Check. GET /api/v1/spamhaus-intelligence/domain-senders/{spamhausDomainSenderCheck_uuid}.
 * @param {Object} input
 * @param {string} input.spamhausDomainSenderCheck_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: spamhausDomainSenderCheck_uuid is required when spamhausDomainSenderCheck_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function showDomainSenderCheck(input) {
  const req = inputObject(input);
  const spamhausDomainSenderCheck_uuid = requireText(req, "spamhausDomainSenderCheck_uuid");
  return emailguardRequest(`/api/v1/spamhaus-intelligence/domain-senders/${encodeURIComponent(spamhausDomainSenderCheck_uuid)}`, "GET");
}
