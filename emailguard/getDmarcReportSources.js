/**
 * @description Get DMARC Report Sources. GET /api/v1/dmarc-reports/domains/{domain_uuid}/dmarc-sources.
 * @param {Object} input
 * @param {string} input.domain_uuid
 * @param {string} input.start_date
 * @param {string} input.end_date
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: domain_uuid is required when domain_uuid is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: start_date is required when start_date is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: end_date is required when end_date is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function getDmarcReportSources(input) {
  const req = inputObject(input);
  const domain_uuid = requireText(req, "domain_uuid");
  const query = {};
  query.start_date = requireText(req, "start_date");
  query.end_date = requireText(req, "end_date");
  return emailguardRequest(`/api/v1/dmarc-reports/domains/${encodeURIComponent(domain_uuid)}/dmarc-sources`, "GET", query);
}
