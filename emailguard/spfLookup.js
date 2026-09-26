/**
 * @description SPF Lookup. GET /api/v1/email-authentication/spf-lookup.
 * @param {Object} input
 * @param {string} input.domain
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain is required when domain is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function spfLookup(input) {
  const req = inputObject(input);
  const query = {};
  query.domain = requireText(req, "domain");
  return emailguardRequest("/api/v1/email-authentication/spf-lookup", "GET", query);
}
