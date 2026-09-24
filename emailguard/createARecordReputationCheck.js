/**
 * @description Queue a Spamhaus A-record reputation check. Poll getARecordReputationCheck until status is completed.
 * @param {Object} input
 * @returns {Object}
 */
async function createARecordReputationCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const body = {};
  body.domain = domain;
  return runAuthed("/api/v1/spamhaus-intelligence/a-record-reputation/create", "POST", body, "A_RECORD_REPUTATION_CHECK_CREATED", "A_RECORD_REPUTATION_CHECK_CREATE_FAILED");
}
