/**
 * @description Get the IP of the current workspace hosted domain redirect.
 * @returns {Object}
 */
async function getHostedDomainRedirectIp() {
  return runAuthed("/api/v1/hosted-domain-redirects/ip", "GET", undefined, "HOSTED_DOMAIN_REDIRECT_IP", "HOSTED_DOMAIN_REDIRECT_IP_FAILED");
}
