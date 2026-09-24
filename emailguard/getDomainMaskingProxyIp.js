/**
 * @description Get the IP of the current workspace domain masking proxy.
 * @returns {Object}
 */
async function getDomainMaskingProxyIp() {
  return runAuthed("/api/v1/domain-masking-proxies/ip", "GET", undefined, "DOMAIN_MASKING_PROXY_IP", "DOMAIN_MASKING_PROXY_IP_FAILED");
}
