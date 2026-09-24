/**
 * @description Update DKIM records for a connected domain.
 * @param {Object} input
 * @returns {Object}
 */
async function updateDomainDkimRecords(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain_uuid = asString(firstPresent(req, ["domain_uuid", "domainUuid", "uuid"]));
  if (!domain_uuid) return missingInput("domain_uuid");
  const dkim_selectors = asJsonList(firstPresent(req, ["dkim_selectors", "dkimSelectors"]));
  if (!dkim_selectors.length) return missingInput("dkim_selectors");
  let path = "/api/v1/domains/dkim-records/{domain_uuid}";
  path = path.replace("{domain_uuid}", encodeURIComponent(domain_uuid));
  const body = {};
  body.dkim_selectors = dkim_selectors;
  return runAuthed(path, "PATCH", body, "DKIM_UPDATED", "DKIM_UPDATE_FAILED");
}
