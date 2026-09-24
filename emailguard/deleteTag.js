/**
 * @description Delete a tag. Permanent.
 * @param {Object} input
 * @returns {Object}
 */
async function deleteTag(input) {
  const req = input && typeof input === "object" ? input : {};
  const tag_uuid = asString(firstPresent(req, ["tag_uuid", "tagUuid", "uuid", "id"]));
  if (!tag_uuid) return missingInput("tag_uuid");
  let path = "/api/v1/tags/{tag_uuid}";
  path = path.replace("{tag_uuid}", encodeURIComponent(tag_uuid));
  return runAuthed(path, "DELETE", undefined, "TAG_DELETED", "TAG_DELETE_FAILED");
}
