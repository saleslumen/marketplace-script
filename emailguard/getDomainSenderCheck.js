/**
 * @description Get one Spamhaus domain sender check.
 * @param {Object} input
 * @returns {Object}
 */
async function getDomainSenderCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const spamhausDomainSenderCheck_uuid = asString(firstPresent(req, ["spamhausDomainSenderCheck_uuid", "spamhausDomainSenderCheckUuid", "uuid", "id"]));
  if (!spamhausDomainSenderCheck_uuid) return missingInput("spamhausDomainSenderCheck_uuid");
  let path = "/api/v1/spamhaus-intelligence/domain-senders/{spamhausDomainSenderCheck_uuid}";
  path = path.replace("{spamhausDomainSenderCheck_uuid}", encodeURIComponent(spamhausDomainSenderCheck_uuid));
  return runAuthed(path, "GET", undefined, "DOMAIN_SENDER_CHECK", "DOMAIN_SENDER_CHECK_FAILED");
}
