/**
 * @description Queue a Spamhaus domain context check. Poll getDomainContextCheck for results.
 * @param {Object} input
 * @returns {Object}
 */
async function createDomainContextCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const body = {};
  body.domain = domain;
  return runAuthed("/api/v1/spamhaus-intelligence/domain-contexts/create", "POST", body, "DOMAIN_CONTEXT_CHECK_CREATED", "DOMAIN_CONTEXT_CHECK_CREATE_FAILED");
}
