/**
 * @description List spam filter tests for the authenticated workspace.
 * @returns {Object}
 */
async function listSpamFilterTests() {
  return runAuthed("/api/v1/spam-filter-tests", "GET", undefined, "SPAM_FILTER_TESTS", "SPAM_FILTER_TESTS_FAILED");
}
