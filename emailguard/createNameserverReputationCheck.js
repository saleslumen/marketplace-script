/**
 * @description Queue a Spamhaus nameserver reputation check. Poll getNameserverReputationCheck for results.
 * @param {Object} input
 * @returns {Object}
 */
async function createNameserverReputationCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const body = {};
  body.domain = domain;
  return runAuthed("/api/v1/spamhaus-intelligence/nameserver-reputation/create", "POST", body, "NAMESERVER_REPUTATION_CHECK_CREATED", "NAMESERVER_REPUTATION_CHECK_CREATE_FAILED");
}
