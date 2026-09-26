/**
 * @description List DMARC Report Domains. GET /api/v1/dmarc-reports.
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function listDmarcReportDomains() {
  return emailguardRequest("/api/v1/dmarc-reports", "GET");
}
