/**
 * @description Show Domain Details. GET /api/v1/domains/{uuid}.
 * @param {Object} input
 * @param {string} input.uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: uuid is required when uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function showDomainDetails(input) {
  const req = inputObject(input);
  const uuid = requireText(req, "uuid");
  return emailguardRequest(`/api/v1/domains/${encodeURIComponent(uuid)}`, "GET");
}
