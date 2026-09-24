/**
 * @description List Spamhaus nameserver reputation checks.
 * @returns {Object}
 */
async function listNameserverReputationChecks() {
  return runAuthed("/api/v1/spamhaus-intelligence/nameserver-reputation", "GET", undefined, "NAMESERVER_REPUTATION_CHECKS", "NAMESERVER_REPUTATION_CHECKS_FAILED");
}
