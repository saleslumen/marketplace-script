/**
 * @description Update DMARC Record. PATCH /api/v1/domains/dmarc-record/{domain_uuid}.
 * @param {Object} input
 * @param {string} input.domain_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain_uuid is required when domain_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function updateDmarcRecord(input) {
  const req = inputObject(input);
  const domain_uuid = requireText(req, "domain_uuid");
  return emailguardRequest(`/api/v1/domains/dmarc-record/${encodeURIComponent(domain_uuid)}`, "PATCH");
}
