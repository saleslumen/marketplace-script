/**
 * @description Create Ad-Hoc Blacklist Check. POST /api/v1/blacklist-checks/ad-hoc.
 * @param {Object} input
 * @param {string} input.domain_or_ip
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain_or_ip is required when domain_or_ip is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function createAdHocBlacklistCheck(input) {
  const req = inputObject(input);
  const body = {};
  body.domain_or_ip = requireText(req, "domain_or_ip");
  return emailguardRequest("/api/v1/blacklist-checks/ad-hoc", "POST", body);
}
