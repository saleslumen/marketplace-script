/**
 * @description Update the authenticated user's password. Never returns or persists passwords.
 * @param {Object} input
 * @returns {Object}
 */
async function updatePassword(input) {
  const req = input && typeof input === "object" ? input : {};
  const current_password = asString(firstPresent(req, ["current_password", "currentPassword"]));
  if (!current_password) return missingInput("current_password");
  const password = asString(firstPresent(req, ["password"]));
  if (!password) return missingInput("password");
  const password_confirmation = asString(firstPresent(req, ["password_confirmation", "passwordConfirmation"]));
  if (!password_confirmation) return missingInput("password_confirmation");
  const body = {};
  body.current_password = current_password;
  body.password = password;
  body.password_confirmation = password_confirmation;
  return runAuthed("/api/v1/user/password", "PUT", body, "PASSWORD_UPDATED", "PASSWORD_UPDATE_FAILED");
}
