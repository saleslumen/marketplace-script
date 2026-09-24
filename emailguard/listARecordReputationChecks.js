/**
 * @description List Spamhaus A-record reputation checks.
 * @returns {Object}
 */
async function listARecordReputationChecks() {
  return runAuthed("/api/v1/spamhaus-intelligence/a-record-reputation", "GET", undefined, "A_RECORD_REPUTATION_CHECKS", "A_RECORD_REPUTATION_CHECKS_FAILED");
}
