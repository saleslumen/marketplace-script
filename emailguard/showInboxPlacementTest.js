/**
 * @description Show Inbox Placement Test. GET /api/v1/inbox-placement-tests/{id}.
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: id is required when id is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function showInboxPlacementTest(input) {
  const req = inputObject(input);
  const id = requireText(req, "id");
  return emailguardRequest(`/api/v1/inbox-placement-tests/${encodeURIComponent(id)}`, "GET");
}
