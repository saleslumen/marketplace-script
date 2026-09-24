/**
 * @description Create a domain masking proxy.
 * @param {Object} input
 * @returns {Object}
 */
async function createDomainMaskingProxy(input) {
  const req = input && typeof input === "object" ? input : {};
  const masking_domain = asString(firstPresent(req, ["masking_domain", "maskingDomain"]));
  if (!masking_domain) return missingInput("masking_domain");
  const primary_domain = asString(firstPresent(req, ["primary_domain", "primaryDomain"]));
  if (!primary_domain) return missingInput("primary_domain");
  const body = {};
  body.masking_domain = masking_domain;
  body.primary_domain = primary_domain;
  return runAuthed("/api/v1/domain-masking-proxies", "POST", body, "DOMAIN_MASKING_PROXY_CREATED", "DOMAIN_MASKING_PROXY_CREATE_FAILED");
}
