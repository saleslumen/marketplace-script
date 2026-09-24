/**
 * @description Update SPF records for a connected domain.
 * @param {Object} input
 * @returns {Object}
 */
async function updateDomainSpfRecords(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain_uuid = asString(firstPresent(req, ["domain_uuid", "domainUuid", "uuid"]));
  if (!domain_uuid) return missingInput("domain_uuid");
  let path = "/api/v1/domains/spf-record/{domain_uuid}";
  path = path.replace("{domain_uuid}", encodeURIComponent(domain_uuid));
  return runAuthed(path, "PATCH", undefined, "SPF_UPDATED", "SPF_UPDATE_FAILED");
}
