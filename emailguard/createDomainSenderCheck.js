/**
 * @description Queue a Spamhaus domain sender check. Poll getDomainSenderCheck for results.
 * @param {Object} input
 * @returns {Object}
 */
async function createDomainSenderCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const body = {};
  body.domain = domain;
  return runAuthed("/api/v1/spamhaus-intelligence/domain-senders/create", "POST", body, "DOMAIN_SENDER_CHECK_CREATED", "DOMAIN_SENDER_CHECK_CREATE_FAILED");
}
