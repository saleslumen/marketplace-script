/**
 * @description Get DMARC report failures for a domain between two dates.
 * @param {Object} input
 * @returns {Object}
 */
async function getDmarcReportFailures(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain_uuid = asString(firstPresent(req, ["domain_uuid", "domainUuid", "uuid"]));
  if (!domain_uuid) return missingInput("domain_uuid");
  const start_date = asString(firstPresent(req, ["start_date", "startDate"]));
  if (!start_date) return missingInput("start_date");
  const end_date = asString(firstPresent(req, ["end_date", "endDate"]));
  if (!end_date) return missingInput("end_date");
  let path = "/api/v1/dmarc-reports/domains/{domain_uuid}/dmarc-failures";
  path = path.replace("{domain_uuid}", encodeURIComponent(domain_uuid));
  const body = {};
  body.start_date = start_date;
  body.end_date = end_date;
  return runAuthed(path, "GET", body, "DMARC_FAILURES", "DMARC_FAILURES_FAILED");
}
