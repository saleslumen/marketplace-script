/**
 * @description Domain Host Lookup. POST /api/v1/domain-host-lookup.
 * @param {Object} input
 * @param {string} input.domain
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain is required when domain is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function domainHostLookup(input) {
  const req = inputObject(input);
  const body = {};
  body.domain = requireText(req, "domain");
  return emailguardRequest("/api/v1/domain-host-lookup", "POST", body);
}
