/**
 * @description Create Hosted Domain Redirect. POST /api/v1/hosted-domain-redirects.
 * @param {Object} input
 * @param {string} input.domain
 * @param {string} input.redirect
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain is required when domain is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: redirect is required when redirect is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function createHostedDomainRedirect(input) {
  const req = inputObject(input);
  const body = {};
  body.domain = requireText(req, "domain");
  body.redirect = requireText(req, "redirect");
  return emailguardRequest("/api/v1/hosted-domain-redirects", "POST", body);
}
