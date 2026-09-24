/**
 * @description Authenticate with email and password. Returns the documented token in data. Never returns or persists the password. The marketplace connection supplies the API token.
 * @param {Object} input
 * @returns {Object}
 */
async function login(input) {
  const req = input && typeof input === "object" ? input : {};
  const email = asString(firstPresent(req, ["email"]));
  if (!email) return missingInput("email");
  const password = asString(firstPresent(req, ["password"]));
  if (!password) return missingInput("password");
  const body = {};
  body.email = email;
  body.password = password;
  return runPublic("/api/v1/login", "POST", body, "LOGIN", "LOGIN_FAILED");
}
