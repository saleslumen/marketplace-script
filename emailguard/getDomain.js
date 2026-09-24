/**
 * @description Get one domain by uuid.
 * @param {Object} input
 * @returns {Object}
 */
async function getDomain(input) {
  const req = input && typeof input === "object" ? input : {};
  const uuid = asString(firstPresent(req, ["uuid", "domainUuid", "domain_uuid"]));
  if (!uuid) return missingInput("uuid");
  let path = "/api/v1/domains/{uuid}";
  path = path.replace("{uuid}", encodeURIComponent(uuid));
  return runAuthed(path, "GET", undefined, "DOMAIN", "DOMAIN_FAILED");
}
