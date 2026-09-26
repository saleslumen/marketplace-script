/**
 * @description Check Content for Spam. POST /api/v1/content-spam-check.
 * @param {Object} input
 * @param {string} input.content
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: content is required when content is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function checkContentForSpam(input) {
  const req = inputObject(input);
  const body = {};
  body.content = requireText(req, "content");
  return emailguardRequest("/api/v1/content-spam-check", "POST", body);
}
