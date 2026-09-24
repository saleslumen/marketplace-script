/**
 * @description Get one Spamhaus domain reputation check.
 * @param {Object} input
 * @returns {Object}
 */
async function getDomainReputationCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const spamhausDomainReputationCheck_uuid = asString(firstPresent(req, ["spamhausDomainReputationCheck_uuid", "spamhausDomainReputationCheckUuid", "uuid", "id"]));
  if (!spamhausDomainReputationCheck_uuid) return missingInput("spamhausDomainReputationCheck_uuid");
  let path = "/api/v1/spamhaus-intelligence/domain-reputation/{spamhausDomainReputationCheck_uuid}";
  path = path.replace("{spamhausDomainReputationCheck_uuid}", encodeURIComponent(spamhausDomainReputationCheck_uuid));
  return runAuthed(path, "GET", undefined, "DOMAIN_REPUTATION_CHECK", "DOMAIN_REPUTATION_CHECK_FAILED");
}
