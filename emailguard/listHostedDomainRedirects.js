/**
 * @description List hosted domain redirects for the authenticated workspace.
 * @returns {Object}
 */
async function listHostedDomainRedirects() {
  return runAuthed("/api/v1/hosted-domain-redirects", "GET", undefined, "HOSTED_DOMAIN_REDIRECTS", "HOSTED_DOMAIN_REDIRECTS_FAILED");
}
