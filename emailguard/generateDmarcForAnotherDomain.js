/**
 * @description Generate DMARC for Another Domain. POST /api/v1/email-authentication/dmarc-another-domain.
 * @param {Object} input
 * @param {string} input.domain
 * @param {string} input.policy
 * @param {string} input.rua
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain is required when domain is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: policy is required when policy is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: rua is required when rua is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function generateDmarcForAnotherDomain(input) {
  const req = inputObject(input);
  const body = {};
  body.domain = requireText(req, "domain");
  body.policy = requireText(req, "policy");
  body.rua = requireText(req, "rua");
  return emailguardRequest("/api/v1/email-authentication/dmarc-another-domain", "POST", body);
}
