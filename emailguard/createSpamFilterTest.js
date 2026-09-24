/**
 * @description Create a spam filter test.
 * @param {Object} input
 * @returns {Object}
 */
async function createSpamFilterTest(input) {
  const req = input && typeof input === "object" ? input : {};
  const name = asString(firstPresent(req, ["name"]));
  if (!name) return missingInput("name");
  const body = {};
  body.name = name;
  return runAuthed("/api/v1/spam-filter-tests", "POST", body, "SPAM_FILTER_TEST_CREATED", "SPAM_FILTER_TEST_CREATE_FAILED");
}
