/**
 * @description Get one Spamhaus nameserver reputation check.
 * @param {Object} input
 * @returns {Object}
 */
async function getNameserverReputationCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const spamhausNsReputationCheck_uuid = asString(firstPresent(req, ["spamhausNsReputationCheck_uuid", "spamhausNsReputationCheckUuid", "spamhausNameserverReputationCheck_uuid", "spamhausNameserverReputationCheckUuid", "uuid", "id"]));
  if (!spamhausNsReputationCheck_uuid) return missingInput("spamhausNsReputationCheck_uuid");
  let path = "/api/v1/spamhaus-intelligence/nameserver-reputation/{spamhausNsReputationCheck_uuid}";
  path = path.replace("{spamhausNsReputationCheck_uuid}", encodeURIComponent(spamhausNsReputationCheck_uuid));
  return runAuthed(path, "GET", undefined, "NAMESERVER_REPUTATION_CHECK", "NAMESERVER_REPUTATION_CHECK_FAILED");
}
