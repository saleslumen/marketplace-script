/**
 * @description Delete a hosted domain redirect.
 * @param {Object} input
 * @returns {Object}
 */
async function deleteHostedDomainRedirect(input) {
  const req = input && typeof input === "object" ? input : {};
  const hosted_domain_redirect_uuid = asString(firstPresent(req, ["hosted_domain_redirect_uuid", "hostedDomainRedirectUuid", "id", "uuid"]));
  if (!hosted_domain_redirect_uuid) return missingInput("hosted_domain_redirect_uuid");
  let path = "/api/v1/hosted-domain-redirects/{hosted_domain_redirect_uuid}";
  path = path.replace("{hosted_domain_redirect_uuid}", encodeURIComponent(hosted_domain_redirect_uuid));
  return runAuthed(path, "DELETE", undefined, "HOSTED_DOMAIN_REDIRECT_DELETED", "HOSTED_DOMAIN_REDIRECT_DELETE_FAILED");
}
