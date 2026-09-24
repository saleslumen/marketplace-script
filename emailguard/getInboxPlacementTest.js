/**
 * @description Get one inbox placement test, including filter_phrase and seed test email addresses.
 * @param {Object} input
 * @returns {Object}
 */
async function getInboxPlacementTest(input) {
  const req = input && typeof input === "object" ? input : {};
  const id = asString(firstPresent(req, ["id", "uuid"]));
  if (!id) return missingInput("id");
  let path = "/api/v1/inbox-placement-tests/{id}";
  path = path.replace("{id}", encodeURIComponent(id));
  return runAuthed(path, "GET", undefined, "INBOX_PLACEMENT_TEST", "INBOX_PLACEMENT_TEST_FAILED");
}
