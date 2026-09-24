/**
 * @description List inbox placement tests. Each item includes EmailGuard's filter_phrase and seed test addresses.
 * @returns {Object}
 */
async function listInboxPlacementTests() {
  return runAuthed("/api/v1/inbox-placement-tests", "GET", undefined, "INBOX_PLACEMENT_TESTS", "INBOX_PLACEMENT_TESTS_FAILED");
}
