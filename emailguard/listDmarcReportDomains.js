/**
 * @description List domains that have DMARC reports in the current workspace.
 * @returns {Object}
 */
async function listDmarcReportDomains() {
  return runAuthed("/api/v1/dmarc-reports", "GET", undefined, "DMARC_REPORT_DOMAINS", "DMARC_REPORT_DOMAINS_FAILED");
}
