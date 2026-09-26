/**
 * @description DKIM Raw Generator. POST /api/v1/email-authentication/dkim-raw-generator.
 * @param {Object} input
 * @param {number} input.keyLength
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: keyLength is required when keyLength is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function dkimRawGenerator(input) {
  const req = inputObject(input);
  const body = {};
  body.keyLength = requireFiniteNumber(req, "keyLength");
  return emailguardRequest("/api/v1/email-authentication/dkim-raw-generator", "POST", body);
}
