/**
 * @description Delete a domain.
 * @param {Object} input
 * @returns {Object}
 */
async function deleteDomain(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain_uuid = asString(firstPresent(req, ["domain_uuid", "domainUuid", "uuid"]));
  if (!domain_uuid) return missingInput("domain_uuid");
  let path = "/api/v1/domains/delete/{domain_uuid}";
  path = path.replace("{domain_uuid}", encodeURIComponent(domain_uuid));
  return runAuthed(path, "DELETE", undefined, "DOMAIN_DELETED", "DOMAIN_DELETE_FAILED");
}
