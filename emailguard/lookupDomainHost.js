/**
 * @description Look up the domain host or corporate spam filter for a domain.
 * @param {Object} input
 * @returns {Object}
 */
async function lookupDomainHost(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const body = {};
  body.domain = domain;
  return runAuthed("/api/v1/domain-host-lookup", "POST", body, "DOMAIN_HOST", "DOMAIN_HOST_FAILED");
}
