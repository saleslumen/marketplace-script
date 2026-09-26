/**
 * @description Login. POST /api/v1/login.
 * @param {Object} input
 * @param {string} input.email
 * @param {string} input.password
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: email is required when email is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: password is required when password is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function login(input) {
  const req = inputObject(input);
  const body = {};
  body.email = requireText(req, "email");
  body.password = requireText(req, "password");
  return emailguardRequest("/api/v1/login", "POST", body, { auth: false });
}
