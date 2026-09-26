/**
 * @description Update Password. PUT /api/v1/user/password.
 * @param {Object} input
 * @param {string} input.current_password
 * @param {string} input.password
 * @param {string} input.password_confirmation
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: current_password is required when current_password is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: password is required when password is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: password_confirmation is required when password_confirmation is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function updatePassword(input) {
  const req = inputObject(input);
  const body = {};
  body.current_password = requireText(req, "current_password");
  body.password = requireText(req, "password");
  body.password_confirmation = requireText(req, "password_confirmation");
  return emailguardRequest("/api/v1/user/password", "PUT", body);
}
