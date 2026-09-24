/**
 * @description Get one Spamhaus A-record reputation check.
 * @param {Object} input
 * @returns {Object}
 */
async function getARecordReputationCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const spamhausARecordReputationCheck_uuid = asString(firstPresent(req, ["spamhausARecordReputationCheck_uuid", "spamhausARecordReputationCheckUuid", "uuid", "id"]));
  if (!spamhausARecordReputationCheck_uuid) return missingInput("spamhausARecordReputationCheck_uuid");
  let path = "/api/v1/spamhaus-intelligence/a-record-reputation/{spamhausARecordReputationCheck_uuid}";
  path = path.replace("{spamhausARecordReputationCheck_uuid}", encodeURIComponent(spamhausARecordReputationCheck_uuid));
  return runAuthed(path, "GET", undefined, "A_RECORD_REPUTATION_CHECK", "A_RECORD_REPUTATION_CHECK_FAILED");
}
