/**
 * @description Create an inbox placement test by name. EmailGuard returns a unique filter_phrase and seed test email addresses.
 * @param {Object} input
 * @returns {Object}
 */
async function createInboxPlacementTest(input) {
  const req = input && typeof input === "object" ? input : {};
  const name = asString(firstPresent(req, ["name"]));
  if (!name) return missingInput("name");
  const body = {};
  body.name = name;
  return runAuthed("/api/v1/inbox-placement-tests", "POST", body, "INBOX_PLACEMENT_TEST_CREATED", "INBOX_PLACEMENT_TEST_CREATE_FAILED");
}
