/**
 * @description Look up and validate DMARC records for a domain.
 * @param {Object} input
 * @returns {Object}
 */
async function lookupDmarc(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const body = {};
  body.domain = domain;
  return runAuthed("/api/v1/email-authentication/dmarc-lookup", "GET", body, "DMARC_LOOKUP", "DMARC_LOOKUP_FAILED");
}
