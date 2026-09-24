/**
 * @description Look up and validate DKIM records for a domain and selector.
 * @param {Object} input
 * @returns {Object}
 */
async function lookupDkim(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const selector = asString(firstPresent(req, ["selector"]));
  if (!selector) return missingInput("selector");
  const body = {};
  body.domain = domain;
  body.selector = selector;
  return runAuthed("/api/v1/email-authentication/dkim-lookup", "GET", body, "DKIM_LOOKUP", "DKIM_LOOKUP_FAILED");
}
