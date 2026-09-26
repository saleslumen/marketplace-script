/**
 * @description Generate DMARC for Connected Domain. POST /api/v1/email-authentication/dmarc-connected-domain.
 * @param {Object} input
 * @param {string} input.domain_uuid
 * @param {string} input.policy
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain_uuid is required when domain_uuid is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: policy is required when policy is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function generateDmarcForConnectedDomain(input) {
  const req = inputObject(input);
  const body = {};
  body.domain_uuid = requireText(req, "domain_uuid");
  body.policy = requireText(req, "policy");
  return emailguardRequest("/api/v1/email-authentication/dmarc-connected-domain", "POST", body);
}
