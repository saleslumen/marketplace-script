/**
 * @description Get one tag by uuid.
 * @param {Object} input
 * @returns {Object}
 */
async function getTag(input) {
  const req = input && typeof input === "object" ? input : {};
  const uuid = asString(firstPresent(req, ["uuid", "tag_uuid", "tagUuid", "id"]));
  if (!uuid) return missingInput("uuid");
  let path = "/api/v1/tags/{uuid}";
  path = path.replace("{uuid}", encodeURIComponent(uuid));
  return runAuthed(path, "GET", undefined, "TAG", "TAG_FAILED");
}
