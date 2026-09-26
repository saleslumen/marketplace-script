/**
 * @description Create SURBL Blacklist Check. POST /api/v1/surbl-blacklist-checks.
 * @param {Object} input
 * @param {string} input.domain
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain is required when domain is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function createSurblBlacklistCheck(input) {
  const req = inputObject(input);
  const body = {};
  body.domain = requireText(req, "domain");
  return emailguardRequest("/api/v1/surbl-blacklist-checks", "POST", body);
}
