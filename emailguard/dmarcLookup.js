/**
 * @description DMARC Lookup. GET /api/v1/email-authentication/dmarc-lookup.
 * @param {Object} input
 * @param {string} input.domain
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain is required when domain is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function dmarcLookup(input) {
  const req = inputObject(input);
  const query = {};
  query.domain = requireText(req, "domain");
  return emailguardRequest("/api/v1/email-authentication/dmarc-lookup", "GET", query);
}
