/**
 * @description Update the DMARC record for a connected domain.
 * @param {Object} input
 * @returns {Object}
 */
async function updateDomainDmarcRecord(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain_uuid = asString(firstPresent(req, ["domain_uuid", "domainUuid", "uuid"]));
  if (!domain_uuid) return missingInput("domain_uuid");
  let path = "/api/v1/domains/dmarc-record/{domain_uuid}";
  path = path.replace("{domain_uuid}", encodeURIComponent(domain_uuid));
  return runAuthed(path, "PATCH", undefined, "DMARC_UPDATED", "DMARC_UPDATE_FAILED");
}
