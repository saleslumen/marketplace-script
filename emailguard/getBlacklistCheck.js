/**
 * @description Get one blacklist check by id.
 * @param {Object} input
 * @returns {Object}
 */
async function getBlacklistCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const id = asString(firstPresent(req, ["id", "uuid"]));
  if (!id) return missingInput("id");
  let path = "/api/v1/blacklist-checks/{id}";
  path = path.replace("{id}", encodeURIComponent(id));
  return runAuthed(path, "GET", undefined, "BLACKLIST_CHECK", "BLACKLIST_CHECK_FAILED");
}
