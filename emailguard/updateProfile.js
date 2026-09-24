/**
 * @description Update the authenticated user's profile name.
 * @param {Object} input
 * @returns {Object}
 */
async function updateProfile(input) {
  const req = input && typeof input === "object" ? input : {};
  const name = asString(firstPresent(req, ["name"]));
  if (!name) return missingInput("name");
  const body = {};
  body.name = name;
  return runAuthed("/api/v1/user/profile", "PUT", body, "PROFILE_UPDATED", "PROFILE_UPDATE_FAILED");
}
