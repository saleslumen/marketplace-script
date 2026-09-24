/**
 * @description Get one domain masking proxy.
 * @param {Object} input
 * @returns {Object}
 */
async function getDomainMaskingProxy(input) {
  const req = input && typeof input === "object" ? input : {};
  const hosted_domain_redirect_uuid = asString(firstPresent(req, ["hosted_domain_redirect_uuid", "hostedDomainRedirectUuid", "id", "uuid"]));
  if (!hosted_domain_redirect_uuid) return missingInput("hosted_domain_redirect_uuid");
  let path = "/api/v1/domain-masking-proxies/{hosted_domain_redirect_uuid}";
  path = path.replace("{hosted_domain_redirect_uuid}", encodeURIComponent(hosted_domain_redirect_uuid));
  return runAuthed(path, "GET", undefined, "DOMAIN_MASKING_PROXY", "DOMAIN_MASKING_PROXY_FAILED");
}
