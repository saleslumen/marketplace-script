/**
 * @description Email Host Lookup. POST /api/v1/email-host-lookup.
 * @param {Object} input
 * @param {string} input.email
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: email is required when email is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function emailHostLookup(input) {
  const req = inputObject(input);
  const body = {};
  body.email = requireText(req, "email");
  return emailguardRequest("/api/v1/email-host-lookup", "POST", body);
}
