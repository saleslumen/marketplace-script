/**
 * @description Show SURBL Blacklist Check. GET /api/v1/surbl-blacklist-checks/{surblBlacklistCheck_uuid}.
 * @param {Object} input
 * @param {string} input.surblBlacklistCheck_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: surblBlacklistCheck_uuid is required when surblBlacklistCheck_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function showSurblBlacklistCheck(input) {
  const req = inputObject(input);
  const surblBlacklistCheck_uuid = requireText(req, "surblBlacklistCheck_uuid");
  return emailguardRequest(`/api/v1/surbl-blacklist-checks/${encodeURIComponent(surblBlacklistCheck_uuid)}`, "GET");
}
