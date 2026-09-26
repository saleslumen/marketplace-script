/**
 * @description DKIM Lookup. GET /api/v1/email-authentication/dkim-lookup.
 * @param {Object} input
 * @param {string} input.domain
 * @param {string} input.selector
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain is required when domain is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: selector is required when selector is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function dkimLookup(input) {
  const req = inputObject(input);
  const query = {};
  query.domain = requireText(req, "domain");
  query.selector = requireText(req, "selector");
  return emailguardRequest("/api/v1/email-authentication/dkim-lookup", "GET", query);
}
