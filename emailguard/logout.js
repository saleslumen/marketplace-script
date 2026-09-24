/**
 * @description Invalidate the current authentication token.
 * @returns {Object}
 */
async function logout() {
  return runAuthed("/api/v1/user/logout", "POST", undefined, "LOGGED_OUT", "LOGOUT_FAILED");
}
