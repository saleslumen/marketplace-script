/**
 * @description Create a tag.
 * @param {Object} input
 * @returns {Object}
 */
async function createTag(input) {
  const req = input && typeof input === "object" ? input : {};
  const name = asString(firstPresent(req, ["name"]));
  if (!name) return missingInput("name");
  const color = asString(firstPresent(req, ["color"]));
  if (!color) return missingInput("color");
  const body = {};
  body.name = name;
  body.color = color;
  return runAuthed("/api/v1/tags", "POST", body, "TAG_CREATED", "TAG_CREATE_FAILED");
}
