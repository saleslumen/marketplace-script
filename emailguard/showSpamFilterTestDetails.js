/**
 * @description Show Spam Filter Test Details. GET /api/v1/spam-filter-tests/{email_test_uuid}.
 * @param {Object} input
 * @param {string} input.email_test_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: email_test_uuid is required when email_test_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function showSpamFilterTestDetails(input) {
  const req = inputObject(input);
  const email_test_uuid = requireText(req, "email_test_uuid");
  return emailguardRequest(`/api/v1/spam-filter-tests/${encodeURIComponent(email_test_uuid)}`, "GET");
}
