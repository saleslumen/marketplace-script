/**
 * @description Retrieve the authenticated user account details.
 * @returns {Object}
 */
async function getUser() {
  return runAuthed("/api/v1/user", "GET", undefined, "USER", "USER_FAILED");
}
