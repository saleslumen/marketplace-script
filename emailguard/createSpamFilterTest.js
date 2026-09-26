/**
 * @description Create Spam Filter Test. POST /api/v1/spam-filter-tests.
 * @param {Object} input
 * @param {string} input.name
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: name is required when name is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function createSpamFilterTest(input) {
  const req = inputObject(input);
  const body = {};
  body.name = requireText(req, "name");
  return emailguardRequest("/api/v1/spam-filter-tests", "POST", body);
}
