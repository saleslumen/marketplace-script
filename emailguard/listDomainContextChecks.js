/**
 * @description List Spamhaus domain context checks.
 * @returns {Object}
 */
async function listDomainContextChecks() {
  return runAuthed("/api/v1/spamhaus-intelligence/domain-contexts", "GET", undefined, "DOMAIN_CONTEXT_CHECKS", "DOMAIN_CONTEXT_CHECKS_FAILED");
}
