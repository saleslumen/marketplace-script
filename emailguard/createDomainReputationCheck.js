/**
 * @description Queue a Spamhaus domain reputation check. Consumes 4 credits. Poll getDomainReputationCheck until status is completed.
 * @param {Object} input
 * @returns {Object}
 */
async function createDomainReputationCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const body = {};
  body.domain = domain;
  return runAuthed("/api/v1/spamhaus-intelligence/domain-reputation/create", "POST", body, "DOMAIN_REPUTATION_CHECK_CREATED", "DOMAIN_REPUTATION_CHECK_CREATE_FAILED");
}
