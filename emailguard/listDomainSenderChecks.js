/**
 * @description List Spamhaus domain sender checks.
 * @returns {Object}
 */
async function listDomainSenderChecks() {
  return runAuthed("/api/v1/spamhaus-intelligence/domain-senders", "GET", undefined, "DOMAIN_SENDER_CHECKS", "DOMAIN_SENDER_CHECKS_FAILED");
}
