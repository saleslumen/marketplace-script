/**
 * @description List Spamhaus domain reputation checks.
 * @returns {Object}
 */
async function listDomainReputationChecks() {
  return runAuthed("/api/v1/spamhaus-intelligence/domain-reputation", "GET", undefined, "DOMAIN_REPUTATION_CHECKS", "DOMAIN_REPUTATION_CHECKS_FAILED");
}
