/**
 * @description Update DKIM Records. PATCH /api/v1/domains/dkim-records/{domain_uuid}.
 * @param {Object} input
 * @param {string} input.domain_uuid
 * @param {Array} input.dkim_selectors
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain_uuid is required when domain_uuid is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: dkim_selectors is required when dkim_selectors is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: dkim_selectors must be an array when dkim_selectors is not an array
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function updateDkimRecords(input) {
  const req = inputObject(input);
  const domain_uuid = requireText(req, "domain_uuid");
  const body = {};
  body.dkim_selectors = requireArray(req, "dkim_selectors");
  return emailguardRequest(`/api/v1/domains/dkim-records/${encodeURIComponent(domain_uuid)}`, "PATCH", body);
}
