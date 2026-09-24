/**
 * @description Delete a domain masking proxy.
 * @param {Object} input
 * @returns {Object}
 */
async function deleteDomainMaskingProxy(input) {
  const req = input && typeof input === "object" ? input : {};
  const hosted_domain_redirect_uuid = asString(firstPresent(req, ["hosted_domain_redirect_uuid", "hostedDomainRedirectUuid", "id", "uuid"]));
  if (!hosted_domain_redirect_uuid) return missingInput("hosted_domain_redirect_uuid");
  let path = "/api/v1/domain-masking-proxies/{hosted_domain_redirect_uuid}";
  path = path.replace("{hosted_domain_redirect_uuid}", encodeURIComponent(hosted_domain_redirect_uuid));
  return runAuthed(path, "DELETE", undefined, "DOMAIN_MASKING_PROXY_DELETED", "DOMAIN_MASKING_PROXY_DELETE_FAILED");
}
