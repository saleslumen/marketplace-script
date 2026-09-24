/**
 * @description Create a hosted domain redirect.
 * @param {Object} input
 * @returns {Object}
 */
async function createHostedDomainRedirect(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const redirect = asString(firstPresent(req, ["redirect"]));
  if (!redirect) return missingInput("redirect");
  const body = {};
  body.domain = domain;
  body.redirect = redirect;
  return runAuthed("/api/v1/hosted-domain-redirects", "POST", body, "HOSTED_DOMAIN_REDIRECT_CREATED", "HOSTED_DOMAIN_REDIRECT_CREATE_FAILED");
}
