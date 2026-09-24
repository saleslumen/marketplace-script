/**
 * @description Look up and validate SPF records for a domain.
 * @param {Object} input
 * @returns {Object}
 */
async function lookupSpf(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const body = {};
  body.domain = domain;
  return runAuthed("/api/v1/email-authentication/spf-lookup", "GET", body, "SPF_LOOKUP", "SPF_LOOKUP_FAILED");
}
