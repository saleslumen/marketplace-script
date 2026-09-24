/**
 * @description Get one spam filter test.
 * @param {Object} input
 * @returns {Object}
 */
async function getSpamFilterTest(input) {
  const req = input && typeof input === "object" ? input : {};
  const email_test_uuid = asString(firstPresent(req, ["email_test_uuid", "emailTestUuid", "uuid", "id"]));
  if (!email_test_uuid) return missingInput("email_test_uuid");
  let path = "/api/v1/spam-filter-tests/{email_test_uuid}";
  path = path.replace("{email_test_uuid}", encodeURIComponent(email_test_uuid));
  return runAuthed(path, "GET", undefined, "SPAM_FILTER_TEST", "SPAM_FILTER_TEST_FAILED");
}
