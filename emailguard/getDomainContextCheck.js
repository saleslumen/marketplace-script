/**
 * @description Get one Spamhaus domain context check.
 * @param {Object} input
 * @returns {Object}
 */
async function getDomainContextCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const spamhausDomainContextCheck_uuid = asString(firstPresent(req, ["spamhausDomainContextCheck_uuid", "spamhausDomainContextCheckUuid", "uuid", "id"]));
  if (!spamhausDomainContextCheck_uuid) return missingInput("spamhausDomainContextCheck_uuid");
  let path = "/api/v1/spamhaus-intelligence/domain-contexts/{spamhausDomainContextCheck_uuid}";
  path = path.replace("{spamhausDomainContextCheck_uuid}", encodeURIComponent(spamhausDomainContextCheck_uuid));
  return runAuthed(path, "GET", undefined, "DOMAIN_CONTEXT_CHECK", "DOMAIN_CONTEXT_CHECK_FAILED");
}
