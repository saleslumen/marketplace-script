/**
 * @description List tags for the authenticated user.
 * @returns {Object}
 */
async function listTags() {
  return runAuthed("/api/v1/tags", "GET", undefined, "TAGS", "TAGS_FAILED");
}
