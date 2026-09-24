/**
 * @description List domain masking proxies for the authenticated workspace.
 * @returns {Object}
 */
async function listDomainMaskingProxies() {
  return runAuthed("/api/v1/domain-masking-proxies", "GET", undefined, "DOMAIN_MASKING_PROXIES", "DOMAIN_MASKING_PROXIES_FAILED");
}
