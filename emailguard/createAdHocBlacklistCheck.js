/**
 * @description Create an ad-hoc blacklist check for a domain or IPv4 address.
 * @param {Object} input
 * @returns {Object}
 */
async function createAdHocBlacklistCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain_or_ip = asString(firstPresent(req, ["domain_or_ip", "domainOrIp"]));
  if (!domain_or_ip) return missingInput("domain_or_ip");
  const body = {};
  body.domain_or_ip = domain_or_ip;
  return runAuthed("/api/v1/blacklist-checks/ad-hoc", "POST", body, "BLACKLIST_CHECK_CREATED", "BLACKLIST_CHECK_CREATE_FAILED");
}
